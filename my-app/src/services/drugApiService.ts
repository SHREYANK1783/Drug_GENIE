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
  
  // Cache for RxCUI lookups to avoid redundant API calls
  private rxcuiCache: Map<string, string | null> = new Map();
  private interactionCache: Map<string, DrugInteractionResponse | null> = new Map();
  
  // Cache expiration time (1 hour) - Reserved for future cache expiration implementation
  // Currently cache persists for the session lifetime
  // TODO: Implement time-based cache invalidation
  // private readonly CACHE_DURATION = 60 * 60 * 1000;

  /**
   * Get RxCUI (RxNorm Concept Unique Identifier) for a drug name with multiple search strategies
   * Now with caching for faster repeated lookups
   */
  async getRxCui(drugName: string): Promise<string | null> {
    const cacheKey = drugName.toLowerCase().trim();
    
    // Check cache first
    if (this.rxcuiCache.has(cacheKey)) {
      return this.rxcuiCache.get(cacheKey) || null;
    }
    
    try {
      // Try all search strategies in parallel for faster results
      const searchPromises = [
        // Exact match
        fetch(`${this.RXNAV_BASE_URL}/rxcui.json?name=${encodeURIComponent(drugName)}&search=0`)
          .then(r => r.ok ? r.json() : null),
        // Approximate match
        fetch(`${this.RXNAV_BASE_URL}/rxcui.json?name=${encodeURIComponent(drugName)}&search=1`)
          .then(r => r.ok ? r.json() : null),
        // Normalized search
        fetch(`${this.RXNAV_BASE_URL}/rxcui.json?name=${encodeURIComponent(drugName)}&search=2`)
          .then(r => r.ok ? r.json() : null)
      ];
      
      const results = await Promise.allSettled(searchPromises);
      
      // Check results in order of preference
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          const data: RxCuiResponse = result.value;
          if (data.idGroup?.rxnormId?.[0]) {
            const rxcui = data.idGroup.rxnormId[0];
            this.rxcuiCache.set(cacheKey, rxcui);
            return rxcui;
          }
        }
      }

      // If no results, try spelling suggestions as fallback
      try {
        const spellingResponse = await fetch(
          `${this.RXNAV_BASE_URL}/spellingsuggestions.json?name=${encodeURIComponent(drugName)}`
        );
        
        if (spellingResponse.ok) {
          const spellingData = await spellingResponse.json();
          if (spellingData.suggestionGroup?.suggestionList?.suggestion?.[0]) {
            const suggestion = spellingData.suggestionGroup.suggestionList.suggestion[0];
            // Avoid infinite recursion by checking if suggestion is different
            if (suggestion.toLowerCase() !== cacheKey) {
              const rxcui = await this.getRxCui(suggestion);
              if (rxcui) {
                this.rxcuiCache.set(cacheKey, rxcui);
                return rxcui;
              }
            }
          }
        }
      } catch (spellingError) {
        console.error('Spelling suggestion error:', spellingError);
      }

      // Cache null result to avoid repeated failed lookups
      this.rxcuiCache.set(cacheKey, null);
      return null;
    } catch (error) {
      console.error(`Error getting RxCUI for ${drugName}:`, error);
      this.rxcuiCache.set(cacheKey, null);
      return null;
    }
  }

  /**
   * Get drug interactions from RxNav API with caching
   */
  async getDrugInteractions(rxcui: string): Promise<DrugInteractionResponse | null> {
    // Check cache first
    if (this.interactionCache.has(rxcui)) {
      return this.interactionCache.get(rxcui) || null;
    }
    
    try {
      const response = await fetch(
        `${this.RXNAV_BASE_URL}/interaction/interaction.json?rxcui=${rxcui}`,
        { 
          signal: AbortSignal.timeout(10000) // 10 second timeout
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.interactionCache.set(rxcui, data);
      return data;
    } catch (error) {
      console.error(`Error getting interactions for RxCUI ${rxcui}:`, error);
      this.interactionCache.set(rxcui, null);
      return null;
    }
  }

  /**
   * Get drug information from FDA API with timeout and better error handling
   */
  async getFDADrugInfo(drugName: string): Promise<FDALabelResponse | null> {
    try {
      const response = await fetch(
        `${this.FDA_BASE_URL}?search=openfda.generic_name:"${encodeURIComponent(drugName)}"&limit=5`,
        { 
          signal: AbortSignal.timeout(8000) // 8 second timeout for FDA API
        }
      );
      
      if (!response.ok) {
        // FDA API often returns 404 for drugs not in their database
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      // Don't log 404s as errors since they're expected for many drugs
      if (error instanceof Error && !error.message.includes('404')) {
        console.error(`Error getting FDA info for ${drugName}:`, error);
      }
      return null;
    }
  }

  /**
   * Process and combine interaction data from multiple sources
   * Optimized with parallel processing for faster results
   */
  async checkDrugInteractions(medications: string[]): Promise<ProcessedInteraction[]> {
    if (medications.length < 2) {
      return [];
    }

    const interactions: ProcessedInteraction[] = [];
    const drugRxCuis: { [key: string]: string } = {};

    // Get RxCUIs for all medications IN PARALLEL for faster fetching
    const rxcuiPromises = medications.map(async (med) => {
      const rxcui = await this.getRxCui(med);
      return { med, rxcui };
    });
    
    const rxcuiResults = await Promise.allSettled(rxcuiPromises);
    
    // Store successful RxCUI lookups
    rxcuiResults.forEach(result => {
      if (result.status === 'fulfilled' && result.value.rxcui) {
        drugRxCuis[result.value.med] = result.value.rxcui;
      }
    });

    // Check interactions between each pair of medications IN PARALLEL
    const interactionPromises: Promise<ProcessedInteraction[]>[] = [];
    
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const drug1 = medications[i];
        const drug2 = medications[j];
        
        // Create parallel promises for both RxNav and FDA checks
        const promises: Promise<ProcessedInteraction[]>[] = [];
        
        // Get RxNav interactions if we have RxCUI
        if (drugRxCuis[drug1]) {
          promises.push(
            this.getRxNavInteractions(drug1, drug2, drugRxCuis[drug1])
              .catch(err => {
                console.error('RxNav interaction error:', err);
                return [];
              })
          );
        }
        
        // Also check with drug2's RxCUI for bidirectional coverage
        if (drugRxCuis[drug2]) {
          promises.push(
            this.getRxNavInteractions(drug2, drug1, drugRxCuis[drug2])
              .catch(err => {
                console.error('RxNav interaction error:', err);
                return [];
              })
          );
        }

        // Get FDA information for additional context
        promises.push(
          this.getFDAInteractions(drug1, drug2)
            .catch(err => {
              console.error('FDA interaction error:', err);
              return [];
            })
        );
        
        interactionPromises.push(...promises);
      }
    }

    // Wait for all interaction checks to complete
    const allResults = await Promise.allSettled(interactionPromises);
    
    // Collect all successful results
    allResults.forEach(result => {
      if (result.status === 'fulfilled' && result.value) {
        interactions.push(...result.value);
      }
    });

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
   * Get FDA-based interactions and warnings with parallel fetching
   */
  private async getFDAInteractions(drug1: string, drug2: string): Promise<ProcessedInteraction[]> {
    const interactions: ProcessedInteraction[] = [];
    
    try {
      // Fetch both FDA data in parallel for faster results
      const [fdaData1, fdaData2] = await Promise.all([
        this.getFDADrugInfo(drug1).catch(() => null),
        this.getFDADrugInfo(drug2).catch(() => null)
      ]);

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

/**
 * Clear the API service cache (useful for testing or when data needs to be refreshed)
 */
export const clearDrugApiCache = () => {
  const service = drugApiService as any;
  service.rxcuiCache?.clear();
  service.interactionCache?.clear();
};