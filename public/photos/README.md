# Photo drop-in
Per property (folder = property slug): exterior.jpg living.jpg kitchen.jpg bedroom.jpg bath.jpg pool.jpg terrace.jpg garden.jpg
Homepage/About: public/photos/site/<kind>-<seed>.jpg (e.g. exterior-7.jpg, living-30.jpg, portrait-70.jpg)
Recommended: 2400px wide JPG, 16:10 (portraits 3:4). Then set NEXT_PUBLIC_USE_PHOTOS=1 in Vercel and redeploy.
Missing files automatically fall back to the generated artwork.
