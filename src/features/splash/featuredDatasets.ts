import { SearchResult } from '../../qri/search'

interface FeaturedDatasetsType {
  id: string
  title: string
  datasets: SearchResult[]
}

interface FeaturedDatasets {
  [key: string]: FeaturedDatasetsType
}

const featuredDatasets: FeaturedDatasets = {
  popular: {
    id: 'popular',
    title: 'Popular',
    datasets: [
      {
        username: 'chriswhong',
        name: 'my-cool-dataset',
        meta: {
          title: 'NYC Subway Turnstile Counts - 2020',
          description: 'Listing of registered and contracted agencies providing NY Connects Services with Budgeted Units of something or other',
          structure: {
            length: 3289442
          }
        },
        commit: {
          timestamp: 1634655290000
        },
        stats: {
          downloadCount: 27
        },
        followStats: {

        }
      },
      {
        username: 'chriswhong',
        name: 'my-cool-dataset',
        meta: {
          title: 'NYC Subway Turnstile Counts - 2020',
          description: 'Listing of registered and contracted agencies providing NY Connects Services with Budgeted Units of something or other',
          structure: {
            length: 3289442
          }
        },
        commit: {
          timestamp: 1634655290000
        },
        stats: {
          downloadCount: 27
        },
        followStats: {

        }
      },
      {
        username: 'chriswhong',
        name: 'my-cool-dataset',
        meta: {
          title: 'NYC Subway Turnstile Counts - 2020',
          description: 'Listing of registered and contracted agencies providing NY Connects Services with Budgeted Units of something or other',
          structure: {
            length: 3289442
          }
        },
        commit: {
          timestamp: 1634655290000
        },
        stats: {
          downloadCount: 27
        },
        followStats: {

        }
      }
    ]
  },
  latest: {
    id: 'latest',
    title: 'Latest',
    datasets: [
      {
        username: 'foo-user-2',
        name: 'my-cool-dataset',
        meta: {
          title: 'Popular Pizza Places in Madrid',
          description: 'Listing of registered and contracted agencies providing NY Connects Services with Budgeted Units of something or other',
          structure: {
            length: 3289442
          }
        },
        commit: {
          timestamp: 1634655290000
        },
        stats: {
          downloadCount: 27
        },
        followStats: {

        }
      },
      {
        username: 'foo-user-2',
        name: 'figma-usage-stats',
        meta: {
          title: 'Q3 Figma Usage Statistics',
          description: 'Listing of registered and contracted agencies providing NY Connects Services with Budgeted Units of something or other',
          structure: {
            length: 3289442
          }
        },
        commit: {
          timestamp: 1634655290000
        },
        stats: {
          downloadCount: 27
        },
        followStats: {

        }
      },
      {
        username: 'foo-user-2',
        name: 'site-analytics',
        meta: {
          title: 'Website Analytics',
          description: 'Listing of registered and contracted agencies providing NY Connects Services with Budgeted Units of something or other',
          structure: {
            length: 3289442
          }
        },
        commit: {
          timestamp: 1634655290000
        },
        stats: {
          downloadCount: 27
        },
        followStats: {

        }
      }
    ]
  }
}

export default featuredDatasets
