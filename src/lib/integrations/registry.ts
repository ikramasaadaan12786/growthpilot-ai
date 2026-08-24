// GrowthPilot Social Media Integration Registry & Platform Factory

import { BaseSocialIntegration } from './base';
import { InstagramIntegration } from './instagram';
import { FacebookIntegration } from './facebook';
import { LinkedInIntegration } from './linkedin';
import { TikTokIntegration } from './tiktok';
import { SocialPlatform } from '@/types';

export class IntegrationRegistry {
  private static instance: IntegrationRegistry;
  private adapters: Map<SocialPlatform, BaseSocialIntegration> = new Map();

  private constructor() {
    this.registerAdapter(new InstagramIntegration());
    this.registerAdapter(new FacebookIntegration());
    this.registerAdapter(new LinkedInIntegration());
    this.registerAdapter(new TikTokIntegration());
  }

  public static getInstance(): IntegrationRegistry {
    if (!IntegrationRegistry.instance) {
      IntegrationRegistry.instance = new IntegrationRegistry();
    }
    return IntegrationRegistry.instance;
  }

  public registerAdapter(adapter: BaseSocialIntegration): void {
    this.adapters.set(adapter.platform, adapter);
  }

  public getAdapter(platform: SocialPlatform): BaseSocialIntegration {
    const adapter = this.adapters.get(platform);
    if (!adapter) {
      throw new Error(`Integration adapter for platform ${platform} not found.`);
    }
    return adapter;
  }

  public getAllPlatforms(): SocialPlatform[] {
    return Array.from(this.adapters.keys());
  }

  public getAllAdapters(): BaseSocialIntegration[] {
    return Array.from(this.adapters.values());
  }
}

export const platformRegistry = IntegrationRegistry.getInstance();
