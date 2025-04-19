import { env } from '$env/dynamic/private';
import { Feide } from './feide';

export const feide = new Feide(env.FEIDE_CLIENT_ID, env.FEIDE_CLIENT_SECRET);
