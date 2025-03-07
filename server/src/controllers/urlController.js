import { nanoid } from 'nanoid';
import Url from '../models/Url.js';

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const shortUrl = nanoid(8);
    
    const url = new Url({
      originalUrl,
      shortUrl,
      userId: req.userId,
    });

    await url.save();
    res.status(201).json(url);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUrlStats = async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.userId });
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.setDate(now.getDate() - 7));
    const thisMonth = new Date(now.setMonth(now.getMonth() - 1));

    const stats = urls.map(url => ({
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      totalClicks: url.clicks.length,
      todayClicks: url.clicks.filter(click => click.timestamp >= today).length,
      weeklyClicks: url.clicks.filter(click => click.timestamp >= thisWeek).length,
      monthlyClicks: url.clicks.filter(click => click.timestamp >= thisMonth).length,
    }));

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const redirectToUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl });
    
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    url.clicks.push({ timestamp: new Date() });
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};