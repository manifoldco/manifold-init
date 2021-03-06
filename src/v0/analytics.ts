export interface Analytics {
  track: (evt: AnalyticsEvent) => Promise<Response>;
  report: (det: ErrorDetail) => void;
}

/**
 *  Properties that should be found in every analytics event
 */
interface SharedProperties {
  description?: string;
}

interface Payload {
  [k: string]: string | number | boolean | Payload;
}

/**
 *  Metric Event Types are events that are sent for observability telemety.
 *  Based on `name`, what data should be sent?
 */
export type MetricEventTypes =
  | {
      name: 'load';
      properties: {
        duration: number;
      };
    }
  | {
      name: 'first_render';
      properties: {
        duration: number;
      };
    }
  | {
      name: 'rtt_graphql';
      properties: {
        duration: number;
      };
    }
  | {
      name: 'token_received';
      properties: {
        duration: number;
      };
    }
  | {
      name: 'first_render_with_data';
      properties: {
        duration: number;
        rttGraphql: number;
        load: number;
      };
    };

/**
 *  Component Analytics Event Types are events that are sent for customer analytics.
 *  Based on `name`, what data should be sent?
 */
export type ComponentAnalyticsEventTypes =
  | {
      name: 'click';
      properties: Payload;
    }
  | {
      name: 'component-load';
      properties: Payload;
    };

export type MetricEvent = {
  type: 'metric';
} & SharedProperties &
  MetricEventTypes;

export type ComponentAnalyticsEvent = {
  type: 'component-analytics';
} & SharedProperties &
  ComponentAnalyticsEventTypes;

/**
 *  Error analytics event
 */
export interface ErrorEvent extends SharedProperties {
  type: 'error';
  name: string;
  properties: {
    code: string;
    message: string;
    version: string;
    clientId?: string;
  };
}

export interface ErrorDetail {
  name: string;
  code?: string;
  message?: string;
}

export type AnalyticsEvent = ErrorEvent | MetricEvent | ComponentAnalyticsEvent;

export const endpoint = {
  local: 'http://analytics.arigato.tools/v1/events',
  stage: 'https://analytics.stage.manifold.co/v1/events',
  prod: 'https://analytics.manifold.co/v1/events',
};

export interface CreateAnalytics {
  env: 'prod' | 'stage' | 'local';
  element: HTMLElement;
  componentVersion: string;
  clientId?: string;
}

export default function createAnalytics(args: CreateAnalytics): Analytics {
  function stringifyProperties(evt: AnalyticsEvent) {
    return {
      ...evt,
      source: args.element.tagName,
      properties: Object.entries(evt.properties).reduce(
        (properties, [key, value]) => ({ ...properties, [key]: `${value}` }),
        {
          componentName: args.element.tagName,
          version: args.componentVersion,
          clientId: args.clientId,
        }
      ),
    };
  }

  /**
   * Report an error or analytics event to Manifold
   * @param {Object} eventData Event data to send to Manifold
   * @param {string} eventData.type 'event' or 'error'
   * @param {string} eventData.name name_of_event (lowercase with underscores)
   * @param {string} [eventData.description] User-readable description of this event
   * @param {Object} eventData.properties Free-form object of event properties (different names will require different properties)
   * @param {Object} [options] Analytics options
   * @param {string} [options.env] 'prod' (default) or 'stage'
   */
  function track(evt: AnalyticsEvent) {
    const url = endpoint[args.env];

    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(stringifyProperties(evt)),
    });
  }

  function report(detail: ErrorDetail) {
    track({
      type: 'error',
      name: detail.name,
      properties: {
        code: detail.code || '',
        message: detail.message || '',
        version: args.componentVersion,
        clientId: args.clientId || '',
      },
    });

    console.error(detail); // report error (Rollbar, Datadog, etc.)
    const evt = new CustomEvent('manifold-error', { bubbles: true, detail });
    args.element.dispatchEvent(evt);
  }

  return { track, report };
}
