import { Request, Response } from 'express';
import Medicine from '../models/medicineModel';
import { logActivity } from './activityController';

// Get medicine by name
export const getMedicineByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Medicine name is required',
      });
    }

    // Search for medicine by name (case-insensitive)
    const medicine = await Medicine.findOne({
      NAME: { $regex: new RegExp(name, 'i') }
    });

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
    }

    // Log activity
    const user = (req as any).user;
    if (user) {
      await logActivity(
        user._id.toString(),
        user.name || 'User',
        'medicine_search',
        'Medicine information viewed',
        `Viewed: ${medicine.NAME}`,
        { medicineName: medicine.NAME }
      );
    }

    res.status(200).json({
      success: true,
      data: {
        name: medicine.NAME,
        link: medicine.LINK,
        introduction: medicine.INTRODUCTION,
        uses: medicine.USES,
        benefits: medicine.BENEFITS,
        side_effect: medicine.SIDE_EFFECT,
        how_to_use: medicine.HOW_TO_USE,
        how_works: medicine.HOW_WORKS,
        quick_tips: medicine.QUICK_TIPS,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Search medicines by partial name
export const searchMedicines = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    // Search using text index and regex for partial matches
    const medicines = await Medicine.find({
      $or: [
        { NAME: { $regex: new RegExp(query as string, 'i') } },
        { $text: { $search: query as string } }
      ]
    }).limit(10).select('NAME INTRODUCTION');

    // Log activity
    const user = (req as any).user;
    if (user) {
      await logActivity(
        user._id.toString(),
        user.name || 'User',
        'medicine_search',
        'Medicine search performed',
        `Searched for: "${query}"`,
        { searchQuery: query, resultsCount: medicines.length }
      );
    }

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get all medicines (with pagination)
export const getAllMedicines = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const medicines = await Medicine.find()
      .select('NAME INTRODUCTION')
      .skip(skip)
      .limit(limit)
      .sort({ NAME: 1 });

    const total = await Medicine.countDocuments();

    res.status(200).json({
      success: true,
      count: medicines.length,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: medicines,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
