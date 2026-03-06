import type { Config } from 'jest';
import { getJestProjectsAsync } from '@nx/jest';

/**
 * Configuration Jest racine pour le workspace Nx.
 * @returns Promise<Config> Configuration Jest avec projets
 */
export default async (): Promise<Config> => ({
  projects: await getJestProjectsAsync(),
});
