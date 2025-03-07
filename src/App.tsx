import React, { useState, useEffect } from 'react';
import {
  Star,
  MapPin,
  Clock,
  Languages,
  Ban,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Search,
  User,
  Home,
  ChevronRight,
  Calendar,
  Users,
  ArrowRight,
  Check,
  MapPinned,
  Camera,
  ThumbsUp,
  AlertCircle,
  Coffee,
  Bus,
  Wine,
  Utensils,
} from 'lucide-react';

function App() {
  const [selectedDate, setSelectedDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showAllStops, setShowAllStops] = useState(false);
  const [showMobileBooking, setShowMobileBooking] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const imagesSection = document.getElementById('tour-images');
      if (imagesSection) {
        const imagesSectionBottom = imagesSection.offsetTop + imagesSection.offsetHeight;
        setShowMobileBooking(scrollPosition > imagesSectionBottom);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tourData = {
    title: "Tuscany Wine Tour from Florence with Lunch",
    rating: 4.8,
    reviews: 2453,
    location: "Florence, Italy",
    price: 129,
    duration: "8 hours",
    languages: ["English", "Italian", "Spanish"],
    images: [
      "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&q=80&w=2400",
      "https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?auto=format&fit=crop&q=80&w=2400",
      "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&q=80&w=2400",
    ],
    included: [
      { text: "Wine tasting at three wineries", icon: Wine },
      { text: "Traditional Tuscan lunch", icon: Utensils },
      { text: "Professional sommelier guide", icon: User },
      { text: "Hotel pickup and drop-off", icon: Bus },
      { text: "Light refreshments", icon: Coffee },
    ],
    meetingPoint: {
      address: "Piazza della Repubblica, Florence",
      time: "9:30 AM",
      instructions: "Meet your guide in front of the central fountain",
    },
    itineraryStops: [
      {
        number: 1,
        name: "Castello di Verrazzano",
        description: "Begin your journey at this historic castle dating back to the 7th century. Explore the ancient wine cellars and learn about traditional Chianti wine-making methods. Your expert sommelier will guide you through a tasting of their renowned wines, including the prestigious Chianti Classico.",
        duration: "1 hour 30 minutes",
        ticketInfo: "Admission Ticket Included"
      },
      {
        number: 2,
        name: "Organic Wine Estate in Greve",
        description: "Visit a family-owned organic vineyard nestled in the heart of Chianti. Tour the sustainable vineyards and learn about organic wine production. Enjoy a guided tasting of their award-winning organic wines, paired with local olive oil and traditional Tuscan bread.",
        duration: "2 hours",
        ticketInfo: "Admission Ticket Included"
      },
      {
        number: 3,
        name: "Traditional Tuscan Lunch",
        description: "Savor an authentic Tuscan lunch at a charming local restaurant. The menu features regional specialties prepared with fresh, seasonal ingredients. Enjoy multiple courses paired with carefully selected wines from the region.",
        duration: "1 hour 30 minutes",
        ticketInfo: "Meal Included"
      },
      {
        number: 4,
        name: "Historic Cantina in Castellina",
        description: "Explore one of Chianti's oldest wine cellars, carved into ancient tufa rock. Learn about the unique aging process and the importance of terroir in wine production. Conclude with a tasting of premium wines, including their special reserve selections.",
        duration: "1 hour 30 minutes",
        ticketInfo: "Admission Ticket Included"
      },
      {
        number: 5,
        name: "Scenic Chianti Drive",
        description: "End your day with a relaxing drive through the stunning Chianti countryside. Stop at panoramic viewpoints for photos of the rolling hills, vineyards, and medieval villages that make this region famous.",
        duration: "1 hour",
        ticketInfo: "Transport Included"
      }
    ],
    highlights: [
      "Visit three prestigious Chianti wineries",
      "Enjoy a traditional Tuscan lunch with wine pairings",
      "Learn about wine production from expert sommeliers",
      "Explore the beautiful Tuscan countryside",
    ],
    travelerPhotos: [
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1568222450379-48aaf4058452?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800",
    ],
    topReviews: [
      {
        name: "Sarah M.",
        rating: 5,
        date: "March 2024",
        title: "Exceptional wine tour experience!",
        content: "This tour exceeded all our expectations. The guide was incredibly knowledgeable, and the wineries we visited were stunning. The lunch was absolutely delicious!",
        helpful: 45,
      },
      {
        name: "John D.",
        rating: 5,
        date: "February 2024",
        title: "Perfect day in Tuscany",
        content: "A wonderful day exploring the Chianti region. The wines were excellent, and our guide made the experience both educational and fun. Highly recommended!",
        helpful: 32,
      },
    ],
  };

  const faqs = [
    {
      question: "What happens if it rains?",
      answer: "The tour operates rain or shine. In case of severe weather, you'll be offered an alternative date or full refund."
    },
    {
      question: "Is lunch included?",
      answer: "Yes, a traditional Tuscan lunch is included in the tour price, featuring local specialties and wine pairings."
    },
    {
      question: "What's the cancellation policy?",
      answer: "Free cancellation up to 24 hours before the start of the tour. Full refund available."
    },
  ];

  const visibleStops = showAllStops 
    ? tourData.itineraryStops 
    : tourData.itineraryStops.slice(0, 3);

  const BookingForm = () => (
    <>
      <div className="text-3xl font-bold mb-2">€{tourData.price}</div>
      <p className="text-gray-500 mb-6">per person</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Travelers</label>
          <div className="flex items-center border rounded-lg">
            <button
              className="p-2 hover:bg-gray-100"
              onClick={() => setTravelers(Math.max(1, travelers - 1))}
            >
              -
            </button>
            <span className="flex-1 text-center">{travelers}</span>
            <button
              className="p-2 hover:bg-gray-100"
              onClick={() => setTravelers(travelers + 1)}
            >
              +
            </button>
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Check Availability
        </button>

        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
          <span>Reserve Now & Pay Later</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">TravelHub</div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search tours..."
                  className="bg-transparent outline-none"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <User size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-gray-500">
          <Home size={16} />
          <ChevronRight size={16} />
          <span>Tours</span>
          <ChevronRight size={16} />
          <span className="text-gray-900">{tourData.title}</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{tourData.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <Star className="text-yellow-400 fill-current" size={20} />
                <span className="ml-1 font-semibold">{tourData.rating}</span>
                <span className="text-gray-500 ml-1">({tourData.reviews} reviews)</span>
              </div>
              <div className="flex items-center text-gray-500">
                <MapPin size={20} />
                <span className="ml-1">{tourData.location}</span>
              </div>
            </div>

            <div id="tour-images" className="mb-8">
              <div className="aspect-video rounded-lg overflow-hidden mb-2">
                <img
                  src={tourData.images[0]}
                  alt="Tour main"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {tourData.images.slice(1).map((img, idx) => (
                  <div key={idx} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={img}
                      alt={`Tour ${idx + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:hidden mb-8">
              <div className="bg-white rounded-lg border p-6">
                <BookingForm />
              </div>
            </div>

            <div className="border-b mb-8">
              <div className="flex space-x-8">
                {['overview', 'reviews', 'photos'].map((tab) => (
                  <button
                    key={tab}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {selectedTab === 'overview' && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                    <Clock size={20} />
                    <div>
                      <div className="font-semibold">Duration</div>
                      <div className="text-sm text-gray-500">{tourData.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                    <Languages size={20} />
                    <div>
                      <div className="font-semibold">Languages</div>
                      <div className="text-sm text-gray-500">{tourData.languages.join(", ")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                    <Ban size={20} />
                    <div>
                      <div className="font-semibold">Free cancellation</div>
                      <div className="text-sm text-gray-500">Up to 24h before</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                    <Smartphone size={20} />
                    <div>
                      <div className="font-semibold">Mobile ticket</div>
                      <div className="text-sm text-gray-500">Use your phone</div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">What's Included</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tourData.included.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <item.icon size={20} className="text-green-600" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Meeting and Pickup</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-start gap-3 mb-4">
                      <MapPinned className="text-gray-600 mt-1" size={20} />
                      <div>
                        <h3 className="font-semibold">Meeting point</h3>
                        <p className="text-gray-600">{tourData.meetingPoint.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="text-gray-600 mt-1" size={20} />
                      <div>
                        <h3 className="font-semibold">Start time</h3>
                        <p className="text-gray-600">{tourData.meetingPoint.time}</p>
                        <p className="text-sm text-gray-500 mt-1">{tourData.meetingPoint.instructions}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">What To Expect</h2>
                  <div className="space-y-6">
                    {visibleStops.map((stop) => (
                      <div key={stop.number} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                            {stop.number}
                          </button>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg mb-2">{stop.name}</h3>
                          <p className="text-gray-600 mb-2">{stop.description}</p>
                          <p className="text-sm text-gray-500">
                            {stop.duration} • {stop.ticketInfo}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {tourData.itineraryStops.length > 3 && (
                      <button
                        onClick={() => setShowAllStops(!showAllStops)}
                        className="text-blue-600 font-semibold hover:text-blue-700 transition"
                      >
                        {showAllStops ? 'Show less' : `Show ${tourData.itineraryStops.length - 3} more stops`}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Additional Info</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-blue-600 mt-1" size={20} />
                      <div>
                        <h3 className="font-semibold">Not suitable for</h3>
                        <p className="text-gray-600">Pregnant women, people with back problems</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-blue-600 mt-1" size={20} />
                      <div>
                        <h3 className="font-semibold">What to bring</h3>
                        <p className="text-gray-600">Comfortable walking shoes, camera, water</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                  <div className="space-y-2">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="border rounded-lg">
                        <button
                          className="w-full px-4 py-3 flex items-center justify-between"
                          onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        >
                          <span className="font-semibold">{faq.question}</span>
                          {expandedFaq === idx ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        {expandedFaq === idx && (
                          <div className="px-4 pb-3 text-gray-600">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedTab === 'photos' && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Traveler Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {tourData.travelerPhotos.map((photo, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={photo}
                        alt={`Traveler photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Top-Rated Reviews</h2>
                <div className="space-y-6">
                  {tourData.topReviews.map((review, idx) => (
                    <div key={idx} className="border-b pb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} size={16} className="text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="font-semibold">{review.title}</span>
                      </div>
                      <p className="text-gray-600 mb-2">{review.content}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div>
                          <span>{review.name}</span> • <span>{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp size={14} />
                          <span>Helpful ({review.helpful})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg border p-6">
              <BookingForm />
            </div>
          </div>
        </div>
      </main>

      {showMobileBooking && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t p-4 z-50">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xl font-bold">€{tourData.price}</div>
              <div className="text-sm text-gray-500">per person</div>
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Check Availability
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;