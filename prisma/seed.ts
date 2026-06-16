import { PrismaClient, UserRole, ContentStatus, MediaStatus, FeaturedSection } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding database...");

  // Clear existing data (in order of relations)
  await prisma.activityLog.deleteMany({});
  await prisma.pageView.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  await prisma.newsletterSubscriber.deleteMany({});
  await prisma.siteSetting.deleteMany({});
  await prisma.advertisement.deleteMany({});
  await prisma.featuredContent.deleteMany({});
  await prisma.heroSlide.deleteMany({});
  await prisma.homepageSection.deleteMany({});
  await prisma.savedItem.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.placeReview.deleteMany({});
  await prisma.placeImage.deleteMany({});
  await prisma.touristPlace.deleteMany({});
  await prisma.placeCategory.deleteMany({});
  await prisma.blogTag.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.blog.deleteMany({});
  await prisma.blogCategory.deleteMany({});
  await prisma.galleryPhoto.deleteMany({});
  await prisma.gallery.deleteMany({});
  await prisma.photo.deleteMany({});
  await prisma.photoCategory.deleteMany({});
  await prisma.video.deleteMany({});
  await prisma.videoCategory.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.eventCategory.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.follow.deleteMany({});
  await prisma.contributorProfile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🧹 Cleaned database tables.");

  // Hash password
  const hashedPassword = await bcryptjs.hash("password123", 12);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@kishtwartourism.gov.in",
      password: hashedPassword,
      name: "Admin Officer KTDA",
      username: "admin_ktda",
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
      bio: "Official Super Admin account of Kishtwar Tourism Development Authority (KTDA).",
      avatar: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    },
  });

  const contributor = await prisma.user.create({
    data: {
      email: "contributor@kishtwartourism.gov.in",
      password: hashedPassword,
      name: "Naman Sharma",
      username: "naman_sharma",
      role: UserRole.CONTRIBUTOR,
      emailVerified: true,
      bio: "Local explorer, travel photographer, and history writer from Kishtwar, J&K.",
      avatar: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      email: "user@kishtwartourism.gov.in",
      password: hashedPassword,
      name: "Aryan Sen",
      username: "aryan_sen",
      role: UserRole.USER,
      emailVerified: true,
      bio: "Adventure enthusiast and frequent traveler to the Himalayan region.",
    },
  });

  console.log("👥 Created users.");

  // 2. Create Contributor Profile
  await prisma.contributorProfile.create({
    data: {
      userId: contributor.id,
      specialty: "Travel Photography & Trekking Guides",
      website: "https://kishtwartravels.in",
      socialFacebook: "https://facebook.com/naman",
      socialInstagram: "https://instagram.com/naman",
      socialTwitter: "https://twitter.com/naman",
      socialYoutube: "https://youtube.com/naman",
      verified: true,
      approvedAt: new Date(),
    },
  });

  console.log("💼 Created contributor profile.");

  // 3. Create Categories
  const placeCategories = await Promise.all([
    prisma.placeCategory.create({ data: { name: "Natural Attractions", slug: "natural-attractions", icon: "Compass", description: "Valleys, rivers, fields, meadows, and mountains of Kishtwar.", sortOrder: 1 } }),
    prisma.placeCategory.create({ data: { name: "Religious Sites", slug: "religious-sites", icon: "Shrine", description: "Historic shrines, temples, mosques, and pilgrimage routes.", sortOrder: 2 } }),
    prisma.placeCategory.create({ data: { name: "Historical Sites", slug: "historical-sites", icon: "History", description: "Heritage forts, ancient monuments, and old settlements.", sortOrder: 3 } }),
    prisma.placeCategory.create({ data: { name: "Adventure Spots", slug: "adventure-spots", icon: "Tent", description: "Trekking routes, rock climbing, camping grounds, and snow sports.", sortOrder: 4 } }),
    prisma.placeCategory.create({ data: { name: "Hidden Gems", slug: "hidden-gems", icon: "Sparkles", description: "Offbeat and lesser-known scenic spots in the district.", sortOrder: 5 } }),
  ]);

  const blogCategories = await Promise.all([
    prisma.blogCategory.create({ data: { name: "Travel Guides", slug: "travel-guides", description: "Itineraries and guides for traveling in Kishtwar.", sortOrder: 1 } }),
    prisma.blogCategory.create({ data: { name: "Cultural Heritage", slug: "cultural-heritage", description: "Stories of languages, folklore, shrines, and traditional music.", sortOrder: 2 } }),
    prisma.blogCategory.create({ data: { name: "Saffron & Sapphire", slug: "saffron-sapphire", description: "All about Kishtwar saffron cultivation and Paddar sapphires.", sortOrder: 3 } }),
    prisma.blogCategory.create({ data: { name: "Trekking Diaries", slug: "trekking-diaries", description: "Personal trekking experiences in Warwan, Marwah, and Paddar.", sortOrder: 4 } }),
  ]);

  const photoCategories = await Promise.all([
    prisma.photoCategory.create({ data: { name: "Nature & Valleys", slug: "nature-valleys", sortOrder: 1 } }),
    prisma.photoCategory.create({ data: { name: "Festivals & Shrines", slug: "festivals-shrines", sortOrder: 2 } }),
    prisma.photoCategory.create({ data: { name: "Adventure & Snow", slug: "adventure-snow", sortOrder: 3 } }),
  ]);

  const videoCategories = await Promise.all([
    prisma.videoCategory.create({ data: { name: "Documentaries", slug: "documentaries", sortOrder: 1 } }),
    prisma.videoCategory.create({ data: { name: "Travel Vlogs", slug: "travel-vlogs", sortOrder: 2 } }),
  ]);

  const eventCategories = await Promise.all([
    prisma.eventCategory.create({ data: { name: "Religious Pilgrimages", slug: "religious-pilgrimages", sortOrder: 1 } }),
    prisma.eventCategory.create({ data: { name: "Cultural Festivals", slug: "cultural-festivals", sortOrder: 2 } }),
  ]);

  console.log("📂 Created categories.");

  // 4. Create Tags
  const tagTrek = await prisma.tag.create({ data: { name: "Trekking", slug: "trekking" } });
  const tagSaffron = await prisma.tag.create({ data: { name: "Saffron", slug: "saffron" } });
  const tagSapphire = await prisma.tag.create({ data: { name: "Sapphire", slug: "sapphire" } });
  const tagHeritage = await prisma.tag.create({ data: { name: "Heritage", slug: "heritage" } });

  // 5. Create Tourist Places
  const place1 = await prisma.touristPlace.create({
    data: {
      name: "Warwan Valley",
      slug: "warwan-valley",
      description: "<h2>The Untouched Paradise of Jammu & Kashmir</h2><p>Warwan Valley is situated in the upper reaches of Kishtwar District and is separated from Kashmir Valley by Margan Pass. The valley stands out for its serene landscape, lush green meadows, clear streams, and isolated traditional wooden architecture. It is an ideal destination for trekking, camping, and experiencing slow village life.</p>",
      shortDescription: "A breathtakingly beautiful valley in Kishtwar, renowned for its pristine river streams, cedar forests, and traditional wooden homes.",
      featuredImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800",
      gpsLat: 33.7251,
      gpsLng: 75.6312,
      altitude: "2,100 meters",
      visitingTime: "Open 24 hours (Day visits recommended)",
      entryFee: "Free",
      bestSeason: "May to September",
      travelTips: "No mobile network connectivity except BSNL (limited). Carry sufficient cash and personal medicine as there are no banks or major hospitals in the inner valley.",
      howToReach: "Reachable via Kokernag-Margan Pass road from Anantnag, Kashmir, or via Kishtwar-Dachhan route on foot.",
      categoryId: placeCategories[0].id,
      contributorId: contributor.id,
      status: ContentStatus.PUBLISHED,
      featured: true,
      averageRating: 5.0,
      reviewCount: 1,
      publishedAt: new Date(),
    },
  });

  const place2 = await prisma.touristPlace.create({
    data: {
      name: "Machail Mata Temple",
      slug: "machail-mata-temple",
      description: "<h2>Historic Pilgrim Shrine in Paddar</h2><p>The Machail Mata Temple is dedicated to Goddess Durga, located in the remote village of Machail in the Paddar region of Kishtwar. Every year in August, thousands of pilgrims undertake a holy foot march from Gulabgarh to Machail, chanting hymns in praise of the goddess. The shrine is surrounded by towering snow-capped mountains and pristine pine trees.</p>",
      shortDescription: "A sacred Hindu shrine dedicated to Goddess Durga in Paddar, hosting the grand annual Machail Yatra pilgrimage.",
      featuredImage: "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=800",
      gpsLat: 33.2975,
      gpsLng: 76.2871,
      altitude: "2,900 meters",
      visitingTime: "6:00 AM - 9:00 PM",
      entryFee: "Free",
      bestSeason: "July to September",
      travelTips: "The foot journey is approximately 30 km from Gulabgarh. Helicopter services are available during the Yatra month (August). Prepare for cold evenings.",
      howToReach: "Reachable via road from Kishtwar to Gulabgarh (Paddar), followed by a trek or helicopter ride to Machail village.",
      categoryId: placeCategories[1].id,
      contributorId: contributor.id,
      status: ContentStatus.PUBLISHED,
      featured: true,
      averageRating: 4.8,
      reviewCount: 0,
      publishedAt: new Date(),
    },
  });

  const place3 = await prisma.touristPlace.create({
    data: {
      name: "Chowgan Ground",
      slug: "chowgan-ground",
      description: "<h2>The Cultural Heart of Kishtwar Town</h2><p>Chowgan is a massive natural turf ground in the center of Kishtwar town, measuring about 165 acres. Surrounded by majestic Chinar trees, it serves as the primary site for local sports, political rallies, cultural events, and festivals. Local citizens gather here in the evenings to socialize and view the sunset behind the surrounding mountains.</p>",
      shortDescription: "A sprawling 165-acre grass turf ground located in the center of Kishtwar town, bordered by iconic Chinar trees.",
      featuredImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
      gpsLat: 33.3134,
      gpsLng: 75.7661,
      altitude: "1,630 meters",
      visitingTime: "Open 24 hours",
      entryFee: "Free",
      bestSeason: "Round the year",
      travelTips: "Great spot for morning walks and evening photography. Try local street snacks sold at the edges of the ground.",
      categoryId: placeCategories[4].id,
      contributorId: contributor.id,
      status: ContentStatus.PUBLISHED,
      featured: false,
      averageRating: 4.5,
      reviewCount: 0,
      publishedAt: new Date(),
    },
  });

  console.log("🏞️ Created tourist places.");

  // 6. Create Place Images
  await prisma.placeImage.create({
    data: {
      placeId: place1.id,
      url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800",
      publicId: "sample_warwan_1",
      caption: "The majestic Warwan River flowing through lush valleys.",
      sortOrder: 1,
    },
  });

  // 7. Create Reviews
  await prisma.placeReview.create({
    data: {
      placeId: place1.id,
      userId: normalUser.id,
      rating: 5,
      title: "Untouched Paradise on Earth",
      content: "Visiting Warwan Valley was a life-changing experience. The local wooden houses, friendly villagers, and crisp mountain streams are unmatched. It feels like stepping back in time.",
    },
  });

  // 8. Create Blogs
  const blog1 = await prisma.blog.create({
    data: {
      title: "Saffron of Kishtwar: The Red Gold of Jammu & Kashmir",
      slug: "saffron-of-kishtwar-the-red-gold",
      content: "<h2>Cultivating the World's Finest Saffron</h2><p>Kishtwar district, along with Pampore, is one of the very few locations in India where saffron (Crocus sativus) is grown. The saffron of Kishtwar is highly prized for its dark red color, strong aroma, and high medicinal value. Cultivated mainly on the uplands of Kishtwar, locally known as *mands*, the saffron harvest takes place in late October and November, turning the fields into a canvas of purple flowers.</p>",
      excerpt: "Explore the historic fields, harvesting methods, and unique qualities of Kishtwar's world-famous purple saffron flowers.",
      featuredImage: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800",
      readingTime: 5,
      categoryId: blogCategories[2].id,
      authorId: contributor.id,
      status: ContentStatus.PUBLISHED,
      featured: true,
      publishedAt: new Date(),
    },
  });

  const blog2 = await prisma.blog.create({
    data: {
      title: "The Ultimate Guide to Trekking in Paddar Valley",
      slug: "ultimate-guide-trekking-paddar-valley",
      content: "<h2>Exploring the Trails of Paddar</h2><p>Paddar is a rugged and mountainous region in the eastern part of Kishtwar District, bordered by Ladakh on the north. It is famous for its trekking trails that lead through scenic valleys, mountain passes, and traditional Buddhist and Hindu villages. This guide outlines popular routes including the trek to the Paddar Sapphire mines and cross-over treks to Zanskar.</p>",
      excerpt: "Detailed itineraries, route maps, and planning advice for adventure lovers looking to trek in the rugged Paddar region.",
      featuredImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
      readingTime: 8,
      categoryId: blogCategories[3].id,
      authorId: contributor.id,
      status: ContentStatus.PUBLISHED,
      featured: false,
      publishedAt: new Date(),
    },
  });

  console.log("✍️ Created blogs.");

  // Link blog tags
  await prisma.blogTag.create({ data: { blogId: blog1.id, tagId: tagSaffron.id } });
  await prisma.blogTag.create({ data: { blogId: blog1.id, tagId: tagHeritage.id } });
  await prisma.blogTag.create({ data: { blogId: blog2.id, tagId: tagTrek.id } });

  // 9. Create Photos
  const photo1 = await prisma.photo.create({
    data: {
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800",
      publicId: "photo_warwan_meadows",
      title: "Warwan Meadows in Summer",
      caption: "Lush green meadows stretching as far as the eye can see in Warwan Valley.",
      categoryId: photoCategories[0].id,
      contributorId: contributor.id,
      status: MediaStatus.PUBLISHED,
      featured: true,
      likeCount: 5,
      downloadCount: 12,
    },
  });

  const photo2 = await prisma.photo.create({
    data: {
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
      publicId: "photo_s saffron_bloom",
      title: "Freshly Harvested Saffron Stigmas",
      caption: "Stigmas of Kishtwar saffron separated from the purple petals.",
      categoryId: photoCategories[1].id,
      contributorId: contributor.id,
      status: MediaStatus.PUBLISHED,
      featured: true,
      likeCount: 8,
      downloadCount: 4,
    },
  });

  console.log("📸 Created gallery photos.");

  // 10. Create Videos
  await prisma.video.create({
    data: {
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
      youtubeId: "dQw4w9WgXcQ",
      title: "Kishtwar Tourism Documentary — The Land of Sapphire",
      description: "An official tourism promotion video showcasing the valleys, culture, shrines, and festivals of Kishtwar district.",
      categoryId: videoCategories[0].id,
      contributorId: contributor.id,
      status: MediaStatus.PUBLISHED,
      featured: true,
    },
  });

  // 11. Create Events
  const event1 = await prisma.event.create({
    data: {
      name: "Annual Holy Machail Mata Yatra 2026",
      slug: "annual-holy-machail-mata-yatra-2026",
      description: "<p>The annual pilgrimage to the holy shrine of Chandi Mata at Machail in Paddar starts on July 25th and goes on until September 5th. Millions of devotees visit to seek blessings. KTDA and local authorities set up base camps, drinking water supply, security checkpoints, and helicopter services for a safe trip.</p>",
      shortDescription: "Join the thousands of pilgrims on their sacred trek to the Chandi Mata temple in remote Machail Valley, Paddar.",
      startDate: new Date("2026-07-25"),
      endDate: new Date("2026-09-05"),
      location: "Gulabgarh to Machail village, Paddar, Kishtwar",
      categoryId: eventCategories[0].id,
      contributorId: contributor.id,
      status: ContentStatus.PUBLISHED,
      featured: true,
    },
  });

  console.log("📅 Created events.");

  // 12. Create Site Settings
  await prisma.siteSetting.createMany({
    data: [
      { settingKey: "site_name", settingValue: "Kishtwar – Land of Saffron, Sapphire & Shrines", settingGroup: "general" },
      { settingKey: "site_description", settingValue: "The official tourism, heritage, and stories portal for Kishtwar District, Jammu & Kashmir.", settingGroup: "general" },
      { settingKey: "contact_email", settingValue: "info@kishtwartourism.gov.in", settingGroup: "contact" },
      { settingKey: "contact_phone", settingValue: "+91-1995-259200", settingGroup: "contact" },
      { settingKey: "office_address", settingValue: "KTDA Complex, Chowgan Road, Kishtwar, J&K, 182204", settingGroup: "contact" },
    ],
  });

  // 13. Create Homepage Sections Config
  await prisma.homepageSection.createMany({
    data: [
      { sectionKey: "hero", title: "Hero Carousel", isVisible: true, sortOrder: 1 },
      { sectionKey: "quick_nav", title: "Quick Navigation", isVisible: true, sortOrder: 2 },
      { sectionKey: "explore", title: "Featured Destinations", subtitle: "Handpicked scenic wonders of Kishtwar Valley", isVisible: true, sortOrder: 3 },
      { sectionKey: "stats", title: "Kishtwar in Numbers", isVisible: true, sortOrder: 4 },
      { sectionKey: "culture", title: "Heritage & Shrines", subtitle: "A blend of rich traditions and divine spirituality", isVisible: true, sortOrder: 5 },
      { sectionKey: "saffron_sapphire", title: "Saffron & Sapphire", subtitle: "The world's finest gems and spices", isVisible: true, sortOrder: 6 },
      { sectionKey: "map", title: "Explore on Map", subtitle: "Find your way around the valley", isVisible: true, sortOrder: 7 },
      { sectionKey: "gallery", title: "Visual Gallery", subtitle: "Moments captured by local explorers", isVisible: true, sortOrder: 8 },
      { sectionKey: "blogs", title: "Travel Stories", subtitle: "Narratives and guides by seasoned travelers", isVisible: true, sortOrder: 9 },
      { sectionKey: "events", title: "Upcoming Events", subtitle: "Don't miss the festivals in the valley", isVisible: true, sortOrder: 10 },
      { sectionKey: "newsletter", title: "Newsletter Subscribe", isVisible: true, sortOrder: 11 },
    ],
  });

  // 14. Create Hero Slides
  await prisma.heroSlide.createMany({
    data: [
      {
        title: "Welcome to Kishtwar Valley",
        subtitle: "A land of snow-capped mountains, crystal clear rivers, and untouched alpine meadows.",
        backgroundImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1920",
        ctaText: "Explore Places",
        ctaLink: "/tourist-places",
        sortOrder: 1,
        isActive: true,
      },
      {
        title: "The Holy Machail Yatra",
        subtitle: "Embrace the spiritual trek to Goddess Durga's sacred temple in remote Paddar.",
        backgroundImage: "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=1920",
        ctaText: "View Yatra Guide",
        ctaLink: "/explore/machail-yatra",
        sortOrder: 2,
        isActive: true,
      },
      {
        title: "The Purple Bloom of Saffron",
        subtitle: "Witness the harvesting of the world's most aromatic spice in late autumn.",
        backgroundImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1920",
        ctaText: "Discover Saffron",
        ctaLink: "/saffron-sapphire",
        sortOrder: 3,
        isActive: true,
      },
    ],
  });

  // 15. Link Featured Content
  await prisma.featuredContent.createMany({
    data: [
      { section: FeaturedSection.PLACES, referenceId: place1.id, sortOrder: 1, isActive: true },
      { section: FeaturedSection.PLACES, referenceId: place2.id, sortOrder: 2, isActive: true },
      { section: FeaturedSection.BLOGS, referenceId: blog1.id, sortOrder: 1, isActive: true },
      { section: FeaturedSection.VIDEOS, referenceId: 1, sortOrder: 1, isActive: true },
    ],
  });

  console.log("⚙️ Created site configurations, hero slides, and homepage settings.");
  console.log("🌱 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
