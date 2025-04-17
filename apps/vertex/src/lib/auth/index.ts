import { FEIDE_CLIENT_ID, FEIDE_CLIENT_SECRET } from '$env/static/private';
import { Feide } from './feide';

export const feide = new Feide(FEIDE_CLIENT_ID, FEIDE_CLIENT_SECRET);
