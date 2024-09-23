"use server";

import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from '../utils';

export interface ScrapedProduct {
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: any[]; // Adjust type as necessary
  discountRate: number;
  category: string;
  reviewsCount: number;
  stars: number;
  isOutOfStock: boolean;
  description: string;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
}

export async function scrapeAmazonProduct(url: string): Promise<ScrapedProduct | null> {
  if (!url) return null;

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Go to the Amazon product page
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Get the HTML content of the page
    const content = await page.content();

    // Load content into Cheerio for parsing
    const $ = cheerio.load(content);

    // Extract product data
    const title = $('#productTitle').text().trim();
    const currentPrice = extractPrice(
      $('.priceToPay span.a-price-whole'),
      $('.a.size.base.a-color-price'),
      $('.a-button-selected .a-color-base'),
    );

    const originalPrice = extractPrice(
      $('#priceblock_ourprice'),
      $('.a-price.a-text-price span.a-offscreen'),
      $('#listPrice'),
      $('#priceblock_dealprice'),
      $('.a-size-base.a-color-price')
    );

    const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

    const images = 
      $('#imgBlkFront').attr('data-a-dynamic-image') || 
      $('#landingImage').attr('data-a-dynamic-image') || 
      '{}';

    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($('.a-price-symbol'));
    const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

    const description = extractDescription($);

    // Construct data object with scraped information
    const data: ScrapedProduct = {
      url,
      currency: currency || '$',
      image: imageUrls[0] || '',
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate) || 0,
      category: 'category', // Update as needed
      reviewsCount: 100, // Adjust as necessary
      stars: 4.5, // Adjust as necessary
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    // Close Puppeteer browser
    await browser.close();

    return data;
  } catch (error) {
    console.error("Scraping error:", error);
    return null;
  }
}
