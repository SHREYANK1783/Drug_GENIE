// Types for API responses
export interface RxCuiResponse {
  idGroup?: {
    rxnormId?: string[];
  };
}

export interface DrugInteractionResponse {
  interactionTypeGroup?: Array<{
    interactionType?: Array<{
      comment?: string;
      minConcept?: Array<{
        name?: string;
        rxcui?: string;
      }>;
      interactionPair?: Array<{
        interactionConcept?: Array<{
          minConceptItem?: {
            name?: string;
            rxcui?: string;
          };
          sourceConceptItem?: {
            name?: string;
            rxcui?: string;
          };
        }>;
        severity?: string;
        description?: string;
      }>;
    }>;
  }>;
}

export interface FDALabelResponse {
  results?: Array<{
    warnings?: string[];
    contraindications?: string[];
    drug_interactions?: string[];
    adverse_reactions?: string[];
    openfda?: {
      generic_name?: string[];
      brand_name?: string[];
    };
  }>;
}

export interface ProcessedInteraction {
  drug1: string;
  drug2: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  recommendation: string;
  source: 'rxnav' | 'fda';
  warnings?: string[];
  contraindications?: string[];
}

class DrugApiService {
  private readonly RXNAV_BASE_URL = 'https://rxnav.nlm.nih.gov/REST';
  private readonly FDA_BASE_URL = 'https://api.fda.gov/drug/label.json';

  /**
   * Get RxCUI (RxNorm Concept Unique Identifier) for a drug name with multiple search strategies
   */
  async getRxCui(drugName: string): Promise<string | null> {
    try {
      // Try exact match first
      let response = await fetch(
        `${this.RXNAV_BASE_URL}/rxcui.json?name=${encodeURIComponent(drugName)}&search=0`
      );
      
      if (response.ok) {
        const data: RxCuiResponse = await response.json();
        if (data.idGroup?.rxnormId?.[0]) {
          return data.idGroup.rxnormId[0];
        }
      }

      // Try approximate match
      response = await fetch(
        `${this.RXNAV_BASE_URL}/rxcui.json?name=${encodeURIComponent(drugName)}&search=1`
      );
      
      if (response.ok) {
        const data: RxCuiResponse = await response.json();
        if (data.idGroup?.rxnormId?.[0]) {
          return data.idGroup.rxnormId[0];
        }
      }

      // Try normalized search
      response = await fetch(
        `${this.RXNAV_BASE_URL}/rxcui.json?name=${encodeURIComponent(drugName)}&search=2`
      );
      
      if (response.ok) {
        const data: RxCuiResponse = await response.json();
        if (data.idGroup?.rxnormId?.[0]) {
          return data.idGroup.rxnormId[0];
        }
      }

      // Try spelling suggestions
      const spellingResponse = await fetch(
        `${this.RXNAV_BASE_URL}/spellingsuggestions.json?name=${encodeURIComponent(drugName)}`
      );
      
      if (spellingResponse.ok) {
        const spellingData = await spellingResponse.json();
        if (spellingData.suggestionGroup?.suggestionList?.suggestion?.[0]) {
          const suggestion = spellingData.suggestionGroup.suggestionList.suggestion[0];
          return await this.getRxCui(suggestion);
        }
      }

      return null;
    } catch (error) {
      console.error(`Error getting RxCUI for ${drugName}:`, error);
      return null;
    }
  }

  /**
   * Get drug interactions from RxNav API
   */
  async getDrugInteractions(rxcui: string): Promise<DrugInteractionResponse | null> {
    try {
      const response = await fetch(
        `${this.RXNAV_BASE_URL}/interaction/interaction.json?rxcui=${rxcui}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error getting interactions for RxCUI ${rxcui}:`, error);
      return null;
    }
  }

  /**
   * Get drug information from FDA API
   */
  async getFDADrugInfo(drugName: string): Promise<FDALabelResponse | null> {
    try {
      const response = await fetch(
        `${this.FDA_BASE_URL}?search=openfda.generic_name:"${encodeURIComponent(drugName)}"&limit=5`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error getting FDA info for ${drugName}:`, error);
      return null;
    }
  }

  /**
   * Process and combine interaction data from multiple sources
   */
  async checkDrugInteractions(medications: string[]): Promise<ProcessedInteraction[]> {
    if (medications.length < 2) {
      return [];
    }

    const interactions: ProcessedInteraction[] = [];
    const drugRxCuis: { [key: string]: string } = {};

    // Get RxCUIs for all medications
    for (const med of medications) {
      const rxcui = await this.getRxCui(med);
      if (rxcui) {
        drugRxCuis[med] = rxcui;
      }
    }

    // Check interactions between each pair of medications
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const drug1 = medications[i];
        const drug2 = medications[j];
        
        // Get RxNav interactions
        if (drugRxCuis[drug1]) {
          const rxnavInteractions = await this.getRxNavInteractions(
            drug1, drug2, drugRxCuis[drug1]
          );
          interactions.push(...rxnavInteractions);
        }

        // Get FDA information for additional context
        const fdaInteractions = await this.getFDAInteractions(drug1, drug2);
        interactions.push(...fdaInteractions);
      }
    }

    // Remove duplicates and sort by severity
    return this.deduplicateAndSort(interactions);
  }

  /**
   * Process RxNav interaction data
   */
  private async getRxNavInteractions(
    drug1: string, 
    drug2: string, 
    rxcui: string
  ): Promise<ProcessedInteraction[]> {
    const interactionData = await this.getDrugInteractions(rxcui);
    const interactions: ProcessedInteraction[] = [];

    if (!interactionData?.interactionTypeGroup) {
      return interactions;
    }

    for (const typeGroup of interactionData.interactionTypeGroup) {
      if (!typeGroup.interactionType) continue;

      for (const interactionType of typeGroup.interactionType) {
        if (!interactionType.interactionPair) continue;

        for (const pair of interactionType.interactionPair) {
          if (!pair.interactionConcept) continue;

          // Check if this interaction involves our target drug
          const involvesDrug2 = pair.interactionConcept.some(concept =>
            concept.minConceptItem?.name?.toLowerCase().includes(drug2.toLowerCase()) ||
            concept.sourceConceptItem?.name?.toLowerCase().includes(drug2.toLowerCase())
          );

          if (involvesDrug2) {
            interactions.push({
              drug1,
              drug2,
              severity: this.mapSeverity(pair.severity || 'moderate'),
              description: pair.description || interactionType.comment || 
                          'Potential drug interaction detected. Consult healthcare provider.',
              recommendation: this.generateRecommendation(pair.severity || 'moderate'),
              source: 'rxnav'
            });
          }
        }
      }
    }

    return interactions;
  }

  /**
   * Get FDA-based interactions and warnings
   */
  private async getFDAInteractions(drug1: string, drug2: string): Promise<ProcessedInteraction[]> {
    const interactions: ProcessedInteraction[] = [];
    
    try {
      const fdaData1 = await this.getFDADrugInfo(drug1);
      const fdaData2 = await this.getFDADrugInfo(drug2);

      if (fdaData1?.results?.[0] && fdaData2?.results?.[0]) {
        const result1 = fdaData1.results[0];
        const result2 = fdaData2.results[0];

        // Check for cross-references in drug interactions
        const drug1Interactions = result1.drug_interactions || [];
        const drug2Interactions = result2.drug_interactions || [];

        // Look for mentions of the other drug in interaction warnings
        const hasInteraction = 
          drug1Interactions.some(interaction => 
            interaction.toLowerCase().includes(drug2.toLowerCase())
          ) ||
          drug2Interactions.some(interaction => 
            interaction.toLowerCase().includes(drug1.toLowerCase())
          );

        if (hasInteraction) {
          const relevantInteractions = [
            ...drug1Interactions.filter(i => i.toLowerCase().includes(drug2.toLowerCase())),
            ...drug2Interactions.filter(i => i.toLowerCase().includes(drug1.toLowerCase()))
          ];

          interactions.push({
            drug1,
            drug2,
            severity: 'moderate',
            description: this.cleanFDAText(relevantInteractions.join(' ')),
            recommendation: 'Consult your healthcare provider about this combination.',
            source: 'fda',
            warnings: result1.warnings || result2.warnings,
            contraindications: result1.contraindications || result2.contraindications
          });
        }
      }
    } catch (error) {
      console.error('Error processing FDA interactions:', error);
    }

    return interactions;
  }

  /**
   * Map severity levels
   */
  private mapSeverity(severity: string): 'mild' | 'moderate' | 'severe' {
    const severityLower = severity.toLowerCase();
    if (severityLower.includes('major') || severityLower.includes('severe') || severityLower.includes('contraindicated')) {
      return 'severe';
    } else if (severityLower.includes('moderate') || severityLower.includes('significant')) {
      return 'moderate';
    }
    return 'mild';
  }

  /**
   * Generate recommendations based on severity
   */
  private generateRecommendation(severity: string): string {
    const severityLevel = this.mapSeverity(severity);
    
    switch (severityLevel) {
      case 'severe':
        return 'AVOID this combination. Consult your doctor immediately if you are taking both medications.';
      case 'moderate':
        return 'Use with caution. Monitor for side effects and consult your healthcare provider.';
      case 'mild':
        return 'Generally safe but monitor for any unusual symptoms. Inform your healthcare provider.';
      default:
        return 'Consult your healthcare provider about this medication combination.';
    }
  }

  /**
   * Clean FDA text by removing excessive formatting and technical jargon
   */
  private cleanFDAText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,;:!?-]/g, '')
      .trim()
      .substring(0, 300) + (text.length > 300 ? '...' : '');
  }

  /**
   * Remove duplicate interactions and sort by severity
   */
  private deduplicateAndSort(interactions: ProcessedInteraction[]): ProcessedInteraction[] {
    const seen = new Set<string>();
    const unique = interactions.filter(interaction => {
      const key = `${interaction.drug1}-${interaction.drug2}-${interaction.description}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;             
    });                     
        
    return unique.sort((a, b) => {
      const severityOrder = { severe: 3, moderate: 2, mild: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }
}

export const drugApiService = new DrugApiService();                                                                                        
  