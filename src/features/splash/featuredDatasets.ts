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
        username: 'nyc-transit-data',
        name: 'turnstile_daily_counts_2021',
        meta: {
          title: 'NYC Subway Turnstile Counts - 2021',
          description: 'NYC Subway Turnstile Counts Data aggregated by day and station complex for the year 2021. Updated weekly.',
          structure: {
            length: 11744051
          }
        },
        commit: {
          timestamp: 1634803161000
        },
        stats: {
          downloadCount: 107
        },
        followStats: {

        }
      },
      {
        username: 'casarock',
        name: 'inzidenz-rtk',
        meta: {
          title: 'Corona 7-Tage-Inzidenz im Rheingau-Taunus-Kreis',
          description: 'Extraktion der Inzidenz-Daten für den Rheingau-Taunus-Kreis. Ursprüngliche Datenquelle: https://hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0',
          structure: {
            length: 18200
          }
        },
        commit: {
          timestamp: 1631514921000
        },
        stats: {
          downloadCount: 8
        },
        followStats: {

        }
      },
      {
        username: 'b5',
        name: 'world-bank-population',
        meta: {
          title: 'World Bank Population',
          description: '( 1 ) United Nations Population Division. World Population Prospects: 2017 Revision. ( 2 ) Census reports and other statistical publications from national statistical offices, ( 3 ) Eurostat: Demographic Statistics, ( 4 ) United Nations Statistical Division. Population and Vital Statistics Reprot ( various years ), ( 5 ) U.S. Census Bureau: International Database, and ( 6 ) Secretariat of the Pacific Community: Statistics and Demography Programme.',
          structure: {
            length: 111400
          }
        },
        commit: {
          timestamp: 1598184201000
        },
        stats: {
          downloadCount: 168
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
        username: 'chriswhong-demo',
        name: 'top-ten-us-cities-by-population',
        meta: {
          title: 'Top 10 U.S. Cities by 2020 Population',
          description: 'A simple dataset of the 10 largest cities in the U.S. by population, copied from https://worldpopulationreview.com/us-cities',
          structure: {
            length: 310
          }
        },
        commit: {
          timestamp: 1633523901000
        },
        stats: {
          downloadCount: 0
        },
        followStats: {

        }
      },
      {
        username: 'nyc-transit-data',
        name: 'turnstile_daily_counts_2021',
        meta: {
          title: 'NYC Subway Turnstile Counts - 2021',
          description: 'NYC Subway Turnstile Counts Data aggregated by day and station complex for the year 2021. Updated weekly.',
          structure: {
            length: 11744051
          }
        },
        commit: {
          timestamp: 1634803161000
        },
        stats: {
          downloadCount: 107
        },
        followStats: {

        }
      },
      {
        username: 'casarock',
        name: 'inzidenz-rtk',
        meta: {
          title: 'Corona 7-Tage-Inzidenz im Rheingau-Taunus-Kreis',
          description: 'Extraktion der Inzidenz-Daten für den Rheingau-Taunus-Kreis. Ursprüngliche Datenquelle: https://hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0',
          structure: {
            length: 18200
          }
        },
        commit: {
          timestamp: 1631514921000
        },
        stats: {
          downloadCount: 8
        },
        followStats: {

        }
      },
    ]
  }
}

export default featuredDatasets
