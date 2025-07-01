import type { NextApiRequest, NextApiResponse } from 'next';
import { client, Connect } from '../../lib/mongodb';
import cloudinary from '../../utils/cloudinary';
import getBase64ImageUrl from '../../utils/generateBlurPlaceholder';
import type { ImageProps } from '../../utils/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await Connect();
    console.log("MongoDB connected for images API");

    // Fetch images from Cloudinary
    const results = await cloudinary.v2.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
      .sort_by("public_id", "desc")
      .max_results(400)
      .execute();

    let reducedResults: ImageProps[] = [];

    // Process each image result
    let i = 0;
    for (let result of results.resources) {
      // Check for paywall information in MongoDB
      const paywall = await client
        .db("lnbits-gallery")
        .collection("gallery")
        .findOne({ "public_id": result.public_id });
      
      reducedResults.push({
        id: i,
        height: result.height,
        width: result.width,
        public_id: result.public_id,
        format: result.format,
        paywall: paywall ? paywall.paywall : false,
        display_name: result.display_name
      });
      i++;
    }

    // Generate blur placeholders for all images
    const blurImagePromises = results.resources.map((image: ImageProps) => {
      return getBase64ImageUrl(image);
    });
    const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

    // Add blur data URLs to the results
    for (let i = 0; i < reducedResults.length; i++) {
      reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
    }

    // Return the processed images
    res.status(200).json({
      success: true,
      images: reducedResults,
      count: reducedResults.length
    });

  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch images',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
