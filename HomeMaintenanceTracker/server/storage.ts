import {
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  photos, type Photo, type InsertPhoto,
  notes, type Note, type InsertNote,
  warranties, type Warranty, type InsertWarranty,
  maintenanceEvents, type MaintenanceEvent, type InsertMaintenanceEvent
} from "@shared/schema";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Photo operations
  getPhotos(): Promise<Photo[]>;
  getPhoto(id: number): Promise<Photo | undefined>;
  getPhotosByCategory(categoryId: number): Promise<Photo[]>;
  getRecentPhotos(limit: number): Promise<Photo[]>;
  createPhoto(photo: InsertPhoto, fileBuffer: Buffer): Promise<Photo>;
  updatePhoto(id: number, photo: Partial<InsertPhoto>): Promise<Photo | undefined>;
  deletePhoto(id: number): Promise<boolean>;
  getPhotoFile(id: number): Promise<{ buffer: Buffer, contentType: string } | undefined>;

  // Note operations
  getNotes(): Promise<Note[]>;
  getNote(id: number): Promise<Note | undefined>;
  getNotesByCategory(categoryId: number): Promise<Note[]>;
  getRecentNotes(limit: number): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;

  // Warranty operations
  getWarranties(): Promise<Warranty[]>;
  getWarranty(id: number): Promise<Warranty | undefined>;
  getWarrantiesByCategory(categoryId: number): Promise<Warranty[]>;
  getUpcomingWarranties(days: number): Promise<Warranty[]>;
  createWarranty(warranty: InsertWarranty): Promise<Warranty>;
  updateWarranty(id: number, warranty: Partial<InsertWarranty>): Promise<Warranty | undefined>;
  deleteWarranty(id: number): Promise<boolean>;

  // Maintenance Event operations
  getMaintenanceEvents(): Promise<MaintenanceEvent[]>;
  getMaintenanceEvent(id: number): Promise<MaintenanceEvent | undefined>;
  getMaintenanceEventsByCategory(categoryId: number): Promise<MaintenanceEvent[]>;
  getRecentMaintenanceEvents(limit: number): Promise<MaintenanceEvent[]>;
  createMaintenanceEvent(event: InsertMaintenanceEvent): Promise<MaintenanceEvent>;
  updateMaintenanceEvent(id: number, event: Partial<InsertMaintenanceEvent>): Promise<MaintenanceEvent | undefined>;
  deleteMaintenanceEvent(id: number): Promise<boolean>;

  // Export functionality
  exportData(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private photos: Map<number, Photo>;
  private notes: Map<number, Note>;
  private warranties: Map<number, Warranty>;
  private maintenanceEvents: Map<number, MaintenanceEvent>;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private photoIdCounter: number;
  private noteIdCounter: number;
  private warrantyIdCounter: number;
  private eventIdCounter: number;
  
  private uploadDir: string;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.photos = new Map();
    this.notes = new Map();
    this.warranties = new Map();
    this.maintenanceEvents = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.photoIdCounter = 1;
    this.noteIdCounter = 1;
    this.warrantyIdCounter = 1;
    this.eventIdCounter = 1;
    
    this.uploadDir = path.join(process.cwd(), 'uploads');
    
    // Ensure upload directory exists
    this.ensureUploadDirExists();
    
    // Create default categories
    this.seedDefaultCategories();
  }

  private async ensureUploadDirExists() {
    try {
      const dirExists = await existsAsync(this.uploadDir);
      if (!dirExists) {
        await mkdirAsync(this.uploadDir, { recursive: true });
      }
    } catch (err) {
      console.error('Failed to create upload directory:', err);
    }
  }

  private seedDefaultCategories() {
    const defaultCategories: InsertCategory[] = [
      { name: "Plumbing", color: "#3b82f6" }, // blue
      { name: "Electrical", color: "#10b981" }, // green
      { name: "HVAC", color: "#f59e0b" }, // yellow
      { name: "Appliances", color: "#8b5cf6" }, // purple
      { name: "Garden", color: "#ec4899" }, // pink
    ];

    defaultCategories.forEach(category => {
      this.createCategory(category);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updatedCategory = { ...category, ...categoryUpdate };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Photo operations
  async getPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values());
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async getPhotosByCategory(categoryId: number): Promise<Photo[]> {
    return Array.from(this.photos.values()).filter(
      (photo) => photo.categoryId === categoryId
    );
  }

  async getRecentPhotos(limit: number): Promise<Photo[]> {
    return Array.from(this.photos.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createPhoto(insertPhoto: InsertPhoto, fileBuffer: Buffer): Promise<Photo> {
    const id = this.photoIdCounter++;
    const fileName = `photo_${id}${path.extname(insertPhoto.filePath)}`;
    const filePath = path.join(this.uploadDir, fileName);
    
    // Save the file
    await writeFileAsync(filePath, fileBuffer);
    
    const photo: Photo = {
      ...insertPhoto,
      id,
      filePath: fileName,
      createdAt: new Date()
    };
    
    this.photos.set(id, photo);
    return photo;
  }

  async updatePhoto(id: number, photoUpdate: Partial<InsertPhoto>): Promise<Photo | undefined> {
    const photo = this.photos.get(id);
    if (!photo) return undefined;

    const updatedPhoto = { ...photo, ...photoUpdate };
    this.photos.set(id, updatedPhoto);
    return updatedPhoto;
  }

  async deletePhoto(id: number): Promise<boolean> {
    const photo = this.photos.get(id);
    if (!photo) return false;

    try {
      const filePath = path.join(this.uploadDir, photo.filePath);
      if (await existsAsync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return this.photos.delete(id);
    } catch (error) {
      console.error('Error deleting photo file:', error);
      return false;
    }
  }

  async getPhotoFile(id: number): Promise<{ buffer: Buffer, contentType: string } | undefined> {
    const photo = this.photos.get(id);
    if (!photo) return undefined;

    try {
      const filePath = path.join(this.uploadDir, photo.filePath);
      const buffer = await readFileAsync(filePath);
      return { buffer, contentType: photo.contentType };
    } catch (error) {
      console.error('Error reading photo file:', error);
      return undefined;
    }
  }

  // Note operations
  async getNotes(): Promise<Note[]> {
    return Array.from(this.notes.values());
  }

  async getNote(id: number): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async getNotesByCategory(categoryId: number): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(
      (note) => note.categoryId === categoryId
    );
  }

  async getRecentNotes(limit: number): Promise<Note[]> {
    return Array.from(this.notes.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = this.noteIdCounter++;
    const note: Note = {
      ...insertNote,
      id,
      createdAt: new Date()
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: number, noteUpdate: Partial<InsertNote>): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;

    const updatedNote = { ...note, ...noteUpdate };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: number): Promise<boolean> {
    return this.notes.delete(id);
  }

  // Warranty operations
  async getWarranties(): Promise<Warranty[]> {
    return Array.from(this.warranties.values());
  }

  async getWarranty(id: number): Promise<Warranty | undefined> {
    return this.warranties.get(id);
  }

  async getWarrantiesByCategory(categoryId: number): Promise<Warranty[]> {
    return Array.from(this.warranties.values()).filter(
      (warranty) => warranty.categoryId === categoryId
    );
  }

  async getUpcomingWarranties(days: number): Promise<Warranty[]> {
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + days);

    return Array.from(this.warranties.values()).filter(warranty => {
      const expirationDate = new Date(warranty.expirationDate);
      return expirationDate >= now && expirationDate <= endDate;
    }).sort((a, b) => 
      new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
    );
  }

  async createWarranty(insertWarranty: InsertWarranty): Promise<Warranty> {
    const id = this.warrantyIdCounter++;
    const warranty: Warranty = {
      ...insertWarranty,
      id,
      createdAt: new Date()
    };
    this.warranties.set(id, warranty);
    return warranty;
  }

  async updateWarranty(id: number, warrantyUpdate: Partial<InsertWarranty>): Promise<Warranty | undefined> {
    const warranty = this.warranties.get(id);
    if (!warranty) return undefined;

    const updatedWarranty = { ...warranty, ...warrantyUpdate };
    this.warranties.set(id, updatedWarranty);
    return updatedWarranty;
  }

  async deleteWarranty(id: number): Promise<boolean> {
    return this.warranties.delete(id);
  }

  // Maintenance Event operations
  async getMaintenanceEvents(): Promise<MaintenanceEvent[]> {
    return Array.from(this.maintenanceEvents.values());
  }

  async getMaintenanceEvent(id: number): Promise<MaintenanceEvent | undefined> {
    return this.maintenanceEvents.get(id);
  }

  async getMaintenanceEventsByCategory(categoryId: number): Promise<MaintenanceEvent[]> {
    return Array.from(this.maintenanceEvents.values()).filter(
      (event) => event.categoryId === categoryId
    );
  }

  async getRecentMaintenanceEvents(limit: number): Promise<MaintenanceEvent[]> {
    return Array.from(this.maintenanceEvents.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  async createMaintenanceEvent(insertEvent: InsertMaintenanceEvent): Promise<MaintenanceEvent> {
    const id = this.eventIdCounter++;
    const event: MaintenanceEvent = {
      ...insertEvent,
      id,
      createdAt: new Date()
    };
    this.maintenanceEvents.set(id, event);
    return event;
  }

  async updateMaintenanceEvent(id: number, eventUpdate: Partial<InsertMaintenanceEvent>): Promise<MaintenanceEvent | undefined> {
    const event = this.maintenanceEvents.get(id);
    if (!event) return undefined;

    const updatedEvent = { ...event, ...eventUpdate };
    this.maintenanceEvents.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteMaintenanceEvent(id: number): Promise<boolean> {
    return this.maintenanceEvents.delete(id);
  }

  // Export functionality
  async exportData(): Promise<any> {
    const data = {
      categories: Array.from(this.categories.values()),
      photos: Array.from(this.photos.values()),
      notes: Array.from(this.notes.values()),
      warranties: Array.from(this.warranties.values()),
      maintenanceEvents: Array.from(this.maintenanceEvents.values()),
    };
    return data;
  }
}

export const storage = new MemStorage();
