import { InjectionToken } from '@angular/core';

/** Base URL of the OpsHub API, provided once by the application. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
