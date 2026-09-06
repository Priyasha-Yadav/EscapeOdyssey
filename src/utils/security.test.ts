import { describe, it, expect } from 'vitest';
import { sanitizeInput, isValidEmail, validateCustomActivityInput } from './security';

describe('Security Utility Module', () => {
  describe('sanitizeInput', () => {
    it('should strip dangerous XSS script tags', () => {
      const malicious = '<script>alert("xss")</script>Big Sur Escapes';
      const clean = sanitizeInput(malicious);
      expect(clean).toBe('Big Sur Escapes');
      expect(clean).not.toContain('<script>');
    });

    it('should strip inline HTML event handlers', () => {
      const malicious = '<img src="x" onerror="alert(1)">Mountain Cabin';
      const clean = sanitizeInput(malicious);
      expect(clean).not.toContain('onerror');
    });

    it('should strip javascript pseudo-protocols', () => {
      const malicious = 'javascript:alert("hacked")';
      const clean = sanitizeInput(malicious);
      expect(clean).not.toContain('javascript:');
    });

    it('should strip all surrounding HTML tags', () => {
      const htmlString = '<h1>Title</h1><p>Body</p>';
      const clean = sanitizeInput(htmlString);
      expect(clean).toBe('TitleBody');
    });

    it('should truncate strings exceeding maximum length', () => {
      const longInput = 'A'.repeat(300);
      const clean = sanitizeInput(longInput, 50);
      expect(clean.length).toBe(50);
    });
  });

  describe('isValidEmail', () => {
    it('should validate legitimate email addresses', () => {
      expect(isValidEmail('traveler@odyssey.com')).toBe(true);
      expect(isValidEmail('user.name+tag@sub.domain.org')).toBe(true);
    });

    it('should reject malformed or missing email addresses', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('plainaddress')).toBe(false);
      expect(isValidEmail('@missinguser.com')).toBe(false);
      expect(isValidEmail('missingdomain@.com')).toBe(false);
    });
  });

  describe('validateCustomActivityInput', () => {
    it('should pass valid activity title and non-negative cost', () => {
      const result = validateCustomActivityInput('Sunset Wine Tasting', 45);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedTitle).toBe('Sunset Wine Tasting');
      expect(result.sanitizedCost).toBe(45);
    });

    it('should reject titles shorter than 3 characters', () => {
      const result = validateCustomActivityInput('Hi', 20);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Activity title must be at least 3 characters long.');
    });

    it('should clamp cost bounds between 0 and 10000', () => {
      const resultMax = validateCustomActivityInput('Luxury Helicopter Tour', 15000);
      expect(resultMax.sanitizedCost).toBe(10000);

      const resultNeg = validateCustomActivityInput('Free Trail Walk', -50);
      expect(resultNeg.sanitizedCost).toBe(0);
    });
  });
});
