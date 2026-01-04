import { Film, Series, WatchProgress, User } from '@/types';

// Helper to generate consistent placeholders
const getPoster = (text: string) => 
  `https://placehold.co/600x900/141414/FFFFFF/png?text=${encodeURIComponent(text)}`;

const getBackdrop = (text: string) => 
  `https://placehold.co/1920x1080/0A0A0A/333333/png?text=${encodeURIComponent(text)}`;

const getEpisodeThumb = (text: string) => 
  `https://placehold.co/640x360/1A1A1A/666666/png?text=${encodeURIComponent(text)}`;

export const MOCK_FILMS: Film[] = [
  {
    id: 'oppenheimer',
    type: 'film',
    title: 'Oppenheimer',
    year: 2023,
    duration: '3h 00m',
    rating: 8.5,
    genres: ['Drama', 'History', 'Thriller'],
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon'],
    synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    poster: getPoster('Oppenheimer'),
    backdrop: getBackdrop('Oppenheimer Cinematic'),
    dominantColor: '#D86626', // Fire orange
    badges: ['4K', 'HDR', 'Atmos'],
    maturity: 'R',
    logo: undefined
  },
  {
    id: 'dune-part-two',
    type: 'film',
    title: 'Dune: Part Two',
    year: 2024,
    duration: '2h 46m',
    rating: 8.8,
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
    synopsis: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    poster: getPoster('Dune: Part Two'),
    backdrop: getBackdrop('Arrakis Desert'),
    dominantColor: '#C6823F', // Sand gold
    badges: ['4K', 'Dolby Vision', 'Atmos'],
    maturity: 'PG-13'
  },
  {
    id: 'the-godfather',
    type: 'film',
    title: 'The Godfather',
    year: 1972,
    duration: '2h 55m',
    rating: 9.2,
    genres: ['Crime', 'Drama'],
    director: 'Francis Ford Coppola',
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    synopsis: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster: getPoster('The Godfather'),
    backdrop: getBackdrop('The Godfather'),
    dominantColor: '#2A1F1D', // Dark Brown
    badges: ['4K'],
    maturity: 'R'
  },
  {
    id: 'inception',
    type: 'film',
    title: 'Inception',
    year: 2010,
    duration: '2h 28m',
    rating: 8.8,
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: getPoster('Inception'),
    backdrop: getBackdrop('Inception City Fold'),
    dominantColor: '#3B4C5A', // Steel Blue
    badges: ['4K', 'HDR'],
    maturity: 'PG-13'
  },
  {
    id: 'parasite',
    type: 'film',
    title: 'Parasite',
    year: 2019,
    duration: '2h 12m',
    rating: 8.5,
    genres: ['Thriller', 'Drama', 'Comedy'],
    director: 'Bong Joon Ho',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    synopsis: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    poster: getPoster('Parasite'),
    backdrop: getBackdrop('Parasite House'),
    dominantColor: '#1A1A1A',
    badges: ['4K', 'HDR'],
    maturity: 'R'
  },
  {
    id: 'interstellar',
    type: 'film',
    title: 'Interstellar',
    year: 2014,
    duration: '2h 49m',
    rating: 8.7,
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster: getPoster('Interstellar'),
    backdrop: getBackdrop('Gargantua Black Hole'),
    dominantColor: '#0B1026', // Deep Space Blue
    badges: ['4K', 'HDR', 'Atmos'],
    maturity: 'PG-13'
  },
  {
    id: 'the-dark-knight',
    type: 'film',
    title: 'The Dark Knight',
    year: 2008,
    duration: '2h 32m',
    rating: 9.0,
    genres: ['Action', 'Crime', 'Drama'],
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster: getPoster('The Dark Knight'),
    backdrop: getBackdrop('Gotham City'),
    dominantColor: '#1F2A44', // Dark Blue
    badges: ['4K', 'HDR'],
    maturity: 'PG-13'
  },
  {
    id: 'poor-things',
    type: 'film',
    title: 'Poor Things',
    year: 2023,
    duration: '2h 21m',
    rating: 8.0,
    genres: ['Sci-Fi', 'Romance', 'Comedy'],
    director: 'Yorgos Lanthimos',
    cast: ['Emma Stone', 'Mark Ruffalo', 'Willem Dafoe'],
    synopsis: "The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.",
    poster: getPoster('Poor Things'),
    backdrop: getBackdrop('Surreal London'),
    dominantColor: '#4A6FA5', // Pastel Blue
    badges: ['4K', 'HDR'],
    maturity: 'R'
  },
  {
    id: 'killers-flower-moon',
    type: 'film',
    title: 'Killers of the Flower Moon',
    year: 2023,
    duration: '3h 26m',
    rating: 7.8,
    genres: ['Crime', 'Drama', 'History'],
    director: 'Martin Scorsese',
    cast: ['Leonardo DiCaprio', 'Robert De Niro', 'Lily Gladstone'],
    synopsis: "Real love crosses paths with unspeakable betrayal as Mollie Burkhart, a member of the Osage Nation, tries to save her community from a spree of murders fueled by oil and greed.",
    poster: getPoster('Killers of the Flower Moon'),
    backdrop: getBackdrop('Osage County'),
    dominantColor: '#5C3A2E', // Earthy Brown
    badges: ['4K', 'Atmos'],
    maturity: 'R'
  },
  {
    id: 'past-lives',
    type: 'film',
    title: 'Past Lives',
    year: 2023,
    duration: '1h 45m',
    rating: 8.1,
    genres: ['Drama', 'Romance'],
    director: 'Celine Song',
    cast: ['Greta Lee', 'Teo Yoo', 'John Magaro'],
    synopsis: "Nora and Hae Sung, two deeply connected childhood friends, are wrested apart after her family emigrates from South Korea. Two decades later, they are reunited in New York for one fateful week as they confront notions of destiny, love, and the choices that make a life.",
    poster: getPoster('Past Lives'),
    backdrop: getBackdrop('Seoul & NYC'),
    dominantColor: '#4A6B7C', // Soft Blue
    badges: ['4K'],
    maturity: 'PG-13'
  }
];

export const MOCK_SERIES: Series[] = [
  {
    id: 'breaking-bad',
    type: 'series',
    title: 'Breaking Bad',
    years: '2008-2013',
    seasons: 5,
    episodes: 62,
    rating: 9.5,
    genres: ['Crime', 'Drama', 'Thriller'],
    creator: 'Vince Gilligan',
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
    synopsis: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    poster: getPoster('Breaking Bad'),
    backdrop: getBackdrop('Albuquerque Desert'),
    dominantColor: '#2D5E34', // Chem Green
    badges: ['4K'],
    maturity: 'TV-MA',
    seasonDetails: [
      {
        number: 1,
        episodes: [
          { number: 1, title: 'Pilot', duration: '58m', synopsis: "Walter White, a chemistry teacher, discovers he has cancer and decides to get into the meth-making business.", thumbnail: getEpisodeThumb('BB S1E1') },
          { number: 2, title: 'Cat\'s in the Bag...', duration: '48m', synopsis: "Walt and Jesse try to dispose of the bodies in the RV.", thumbnail: getEpisodeThumb('BB S1E2') },
          { number: 3, title: '...And the Bag\'s in the River', duration: '48m', synopsis: "Walt wrestles with the decision of whether or not to kill Krazy-8.", thumbnail: getEpisodeThumb('BB S1E3') },
        ]
      }
    ]
  },
  {
    id: 'chernobyl',
    type: 'series',
    title: 'Chernobyl',
    years: '2019',
    seasons: 1,
    episodes: 5,
    rating: 9.4,
    genres: ['Drama', 'History', 'Thriller'],
    creator: 'Craig Mazin',
    cast: ['Jared Harris', 'Stellan Skarsgård', 'Jessie Buckley'],
    synopsis: "In April 1986, an explosion at the Chernobyl nuclear power plant in the Union of Soviet Socialist Republics becomes one of the world's worst man-made catastrophes.",
    poster: getPoster('Chernobyl'),
    backdrop: getBackdrop('Chernobyl Reactor'),
    dominantColor: '#3A4A3B', // Muted Green
    badges: ['4K', 'HDR'],
    maturity: 'TV-MA',
    seasonDetails: [
      {
        number: 1,
        episodes: [
           { number: 1, title: '1:23:45', duration: '59m', synopsis: "Plant workers and firefighters put their lives on the line to control a catastrophic April 1986 explosion at a Soviet nuclear power plant.", thumbnail: getEpisodeThumb('Chernobyl Ep1') },
        ]
      }
    ]
  },
  {
    id: 'the-last-of-us',
    type: 'series',
    title: 'The Last of Us',
    years: '2023-',
    seasons: 1,
    episodes: 9,
    rating: 8.8,
    genres: ['Drama', 'Sci-Fi', 'Adventure'],
    creator: 'Neil Druckmann',
    cast: ['Pedro Pascal', 'Bella Ramsey', 'Anna Torv'],
    synopsis: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",
    poster: getPoster('The Last of Us'),
    backdrop: getBackdrop('Ruined City'),
    dominantColor: '#4A5D3A', // Fungus Green
    badges: ['4K', 'HDR', 'Atmos'],
    maturity: 'TV-MA',
    seasonDetails: []
  },
  {
    id: 'severance',
    type: 'series',
    title: 'Severance',
    years: '2022-',
    seasons: 1,
    episodes: 9,
    rating: 8.7,
    genres: ['Sci-Fi', 'Drama', 'Thriller'],
    creator: 'Dan Erickson',
    cast: ['Adam Scott', 'Zach Cherry', 'Britt Lower'],
    synopsis: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.",
    poster: getPoster('Severance'),
    backdrop: getBackdrop('Lumon Industries White Hallway'),
    dominantColor: '#2B4C6F', // Corporate Blue
    badges: ['4K', 'Dolby Vision', 'Atmos'],
    maturity: 'TV-MA',
    seasonDetails: []
  },
  {
    id: 'shogun',
    type: 'series',
    title: 'Shōgun',
    years: '2024',
    seasons: 1,
    episodes: 10,
    rating: 8.7,
    genres: ['Drama', 'History', 'War'],
    creator: 'Rachel Kondo',
    cast: ['Hiroyuki Sanada', 'Cosmo Jarvis', 'Anna Sawai'],
    synopsis: "When a mysterious European ship is found marooned in a nearby fishing village, Lord Yoshii Toranaga discovers secrets that could tip the scales of power and devastate his enemies.",
    poster: getPoster('Shōgun'),
    backdrop: getBackdrop('Feudal Japan'),
    dominantColor: '#5E4B35', // Gold/Brown
    badges: ['4K', 'HDR'],
    maturity: 'TV-MA',
    seasonDetails: []
  },
  {
    id: 'the-bear',
    type: 'series',
    title: 'The Bear',
    years: '2022-',
    seasons: 3,
    episodes: 28,
    rating: 8.6,
    genres: ['Comedy', 'Drama'],
    creator: 'Christopher Storer',
    cast: ['Jeremy Allen White', 'Ebon Moss-Bachrach', 'Ayo Edebiri'],
    synopsis: "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop.",
    poster: getPoster('The Bear'),
    backdrop: getBackdrop('Chaotic Kitchen'),
    dominantColor: '#1A2B4C', // Kitchen Blue
    badges: ['4K'],
    maturity: 'TV-MA',
    seasonDetails: [
        {
            number: 1,
            episodes: [
                { number: 1, title: 'System', duration: '30m', synopsis: "Carmy attempts to retrain the employees of The Original Beef of Chicagoland.", thumbnail: getEpisodeThumb('The Bear S1E1') }
            ]
        },
        {
            number: 2,
            episodes: [
                 { number: 1, title: 'Beef', duration: '35m', synopsis: "Carmy and Sydney begin to develop a new menu.", thumbnail: getEpisodeThumb('The Bear S2E1') }
            ]
        }
    ]
  }
];

export const MOCK_CONTINUE_WATCHING: WatchProgress[] = [
  {
    id: 'breaking-bad',
    progress: 0.45,
    currentTime: 1290, // 21m 30s
    duration: 2880,    // 48m
    updatedAt: new Date().toISOString(),
    season: 1,
    episode: 3
  },
  {
    id: 'oppenheimer',
    progress: 0.54,
    currentTime: 5832, // 1h 37m
    duration: 10800,   // 3h
    updatedAt: new Date(Date.now() - 86400000).toISOString() // yesterday
  },
  {
    id: 'the-bear',
    progress: 0.10,
    currentTime: 210,  // 3m 30s
    duration: 2100,    // 35m
    updatedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    season: 2,
    episode: 1
  }
];

export const MOCK_USER_LIST = [
  'dune-part-two',
  'severance',
  'past-lives',
  'killers-flower-moon',
  'shogun'
];

export const MOCK_USER: User = {
  id: 'u123',
  name: 'Alex D.',
  email: 'alex@example.com',
  avatar: 'https://placehold.co/150x150/E50914/FFFFFF/png?text=AD',
  plan: 'premium'
};