import {
  hasScrolledToTheEnd,
  setScrolledToTheEnd
} from './scrollStatusStore.js'

const makeSessionId = () => crypto.randomUUID().replace( /-/g, '' )
let sessionId = makeSessionId()
let sessionHandle = null
const getSessionId = () => {
  clearTimeout( sessionHandle )
  sessionHandle = setTimeout(
    () => { sessionId = makeSessionId() },
    30 * 60 * 1000 // 30 minutes
  )
  return sessionId
}

let time
const logPageChanged = ( to, from ) => {
  const now = Date.now()

  if ( from.name ) {
    send( {
      event_type: 'pageUnloaded',
      page_name: from.params.title || from.name,
      experiment_group: from.meta.experiment_group,
      session_id: getSessionId(),
      time_length_ms: now - time,
      page_bottom_was_visible: hasScrolledToTheEnd()
    } )
  }

  if ( to && to.name ) {
    send( {
        event_type: 'pageLoaded',
        page_name: to.params.title || to.name,
        experiment_group: to.meta.experiment_group,
        session_id: getSessionId()
    } )
  }

  time = now
  setScrolledToTheEnd( false )
}

const send = ( event ) => {
  const intakeUrl = 'https://intake-analytics.wikimedia.org/v1/events?hasty=true'
  event.$schema = '/analytics/external/wiki_highlights_experiment/1.0.0'
  event.meta = {
    stream: 'inuka.wiki_highlights_experiment',
    domain: 'wikimedia.github.io',
    dt: new Date().toISOString()
  }
  navigator.sendBeacon( intakeUrl, JSON.stringify( event ) )
}

export { logPageChanged }
