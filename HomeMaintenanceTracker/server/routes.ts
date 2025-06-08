import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { z } from "zod";
import fs from "fs";
import path from "path";
import {
  insertCategorySchema,
  insertNoteSchema,
  insertPhotoSchema, 
  insertWarrantySchema,
  insertMaintenanceEventSchema
} from "@shared/schema";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = app.route('/api');
  
  // Categories
  app.get('/api/categories', async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get('/api/categories/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post('/api/categories', async (req: Request, res: Response) => {
    try {
      const result = insertCategorySchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid category data", errors: result.error.format() });
      }
      
      const category = await storage.createCategory(result.data);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put('/api/categories/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertCategorySchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid category data", errors: result.error.format() });
      }
      
      const updatedCategory = await storage.updateCategory(id, result.data);
      
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete('/api/categories/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Photos
  app.get('/api/photos', async (req: Request, res: Response) => {
    try {
      let photos;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      if (categoryId) {
        photos = await storage.getPhotosByCategory(categoryId);
      } else {
        photos = await storage.getPhotos();
      }
      
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  app.get('/api/photos/recent', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const photos = await storage.getRecentPhotos(limit);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent photos" });
    }
  });

  app.get('/api/photos/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const photo = await storage.getPhoto(id);
      
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }
      
      res.json(photo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch photo" });
    }
  });

  app.get('/api/photos/:id/file', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const photoFile = await storage.getPhotoFile(id);
      
      if (!photoFile) {
        return res.status(404).json({ message: "Photo file not found" });
      }
      
      res.set('Content-Type', photoFile.contentType);
      res.send(photoFile.buffer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch photo file" });
    }
  });

  app.post('/api/photos', upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const photoData = {
        title: req.body.title,
        description: req.body.description || null,
        filePath: req.file.originalname,
        contentType: req.file.mimetype,
        categoryId: req.body.categoryId ? parseInt(req.body.categoryId) : null
      };
      
      const result = insertPhotoSchema.safeParse(photoData);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid photo data", errors: result.error.format() });
      }
      
      const photo = await storage.createPhoto(result.data, req.file.buffer);
      res.status(201).json(photo);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload photo" });
    }
  });

  app.put('/api/photos/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertPhotoSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid photo data", errors: result.error.format() });
      }
      
      const updatedPhoto = await storage.updatePhoto(id, result.data);
      
      if (!updatedPhoto) {
        return res.status(404).json({ message: "Photo not found" });
      }
      
      res.json(updatedPhoto);
    } catch (error) {
      res.status(500).json({ message: "Failed to update photo" });
    }
  });

  app.delete('/api/photos/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePhoto(id);
      
      if (!success) {
        return res.status(404).json({ message: "Photo not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete photo" });
    }
  });

  // Notes
  app.get('/api/notes', async (req: Request, res: Response) => {
    try {
      let notes;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      if (categoryId) {
        notes = await storage.getNotesByCategory(categoryId);
      } else {
        notes = await storage.getNotes();
      }
      
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.get('/api/notes/recent', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const notes = await storage.getRecentNotes(limit);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent notes" });
    }
  });

  app.get('/api/notes/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const note = await storage.getNote(id);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });

  app.post('/api/notes', async (req: Request, res: Response) => {
    try {
      const result = insertNoteSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid note data", errors: result.error.format() });
      }
      
      const note = await storage.createNote(result.data);
      res.status(201).json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  app.put('/api/notes/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertNoteSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid note data", errors: result.error.format() });
      }
      
      const updatedNote = await storage.updateNote(id, result.data);
      
      if (!updatedNote) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(updatedNote);
    } catch (error) {
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  app.delete('/api/notes/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteNote(id);
      
      if (!success) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Warranties
  app.get('/api/warranties', async (req: Request, res: Response) => {
    try {
      let warranties;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      if (categoryId) {
        warranties = await storage.getWarrantiesByCategory(categoryId);
      } else {
        warranties = await storage.getWarranties();
      }
      
      res.json(warranties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch warranties" });
    }
  });

  app.get('/api/warranties/upcoming', async (req: Request, res: Response) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const warranties = await storage.getUpcomingWarranties(days);
      res.json(warranties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming warranties" });
    }
  });

  app.get('/api/warranties/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const warranty = await storage.getWarranty(id);
      
      if (!warranty) {
        return res.status(404).json({ message: "Warranty not found" });
      }
      
      res.json(warranty);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch warranty" });
    }
  });

  app.post('/api/warranties', async (req: Request, res: Response) => {
    try {
      const data = {
        ...req.body,
        expirationDate: new Date(req.body.expirationDate)
      };
      
      const result = insertWarrantySchema.safeParse(data);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid warranty data", errors: result.error.format() });
      }
      
      const warranty = await storage.createWarranty(result.data);
      res.status(201).json(warranty);
    } catch (error) {
      res.status(500).json({ message: "Failed to create warranty" });
    }
  });

  app.put('/api/warranties/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      const data = req.body.expirationDate
        ? { ...req.body, expirationDate: new Date(req.body.expirationDate) }
        : req.body;
      
      const result = insertWarrantySchema.partial().safeParse(data);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid warranty data", errors: result.error.format() });
      }
      
      const updatedWarranty = await storage.updateWarranty(id, result.data);
      
      if (!updatedWarranty) {
        return res.status(404).json({ message: "Warranty not found" });
      }
      
      res.json(updatedWarranty);
    } catch (error) {
      res.status(500).json({ message: "Failed to update warranty" });
    }
  });

  app.delete('/api/warranties/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteWarranty(id);
      
      if (!success) {
        return res.status(404).json({ message: "Warranty not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete warranty" });
    }
  });

  // Maintenance Events
  app.get('/api/maintenance-events', async (req: Request, res: Response) => {
    try {
      let events;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      if (categoryId) {
        events = await storage.getMaintenanceEventsByCategory(categoryId);
      } else {
        events = await storage.getMaintenanceEvents();
      }
      
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch maintenance events" });
    }
  });

  app.get('/api/maintenance-events/recent', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const events = await storage.getRecentMaintenanceEvents(limit);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent maintenance events" });
    }
  });

  app.get('/api/maintenance-events/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getMaintenanceEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: "Maintenance event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch maintenance event" });
    }
  });

  app.post('/api/maintenance-events', async (req: Request, res: Response) => {
    try {
      const data = {
        ...req.body,
        date: new Date(req.body.date)
      };
      
      const result = insertMaintenanceEventSchema.safeParse(data);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid maintenance event data", errors: result.error.format() });
      }
      
      const event = await storage.createMaintenanceEvent(result.data);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to create maintenance event" });
    }
  });

  app.put('/api/maintenance-events/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      const data = req.body.date
        ? { ...req.body, date: new Date(req.body.date) }
        : req.body;
      
      const result = insertMaintenanceEventSchema.partial().safeParse(data);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid maintenance event data", errors: result.error.format() });
      }
      
      const updatedEvent = await storage.updateMaintenanceEvent(id, result.data);
      
      if (!updatedEvent) {
        return res.status(404).json({ message: "Maintenance event not found" });
      }
      
      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: "Failed to update maintenance event" });
    }
  });

  app.delete('/api/maintenance-events/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMaintenanceEvent(id);
      
      if (!success) {
        return res.status(404).json({ message: "Maintenance event not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete maintenance event" });
    }
  });

  // Export data
  app.get('/api/export', async (req: Request, res: Response) => {
    try {
      const data = await storage.exportData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
