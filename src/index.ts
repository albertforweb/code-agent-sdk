export type FeatureShell = 'desktop' | 'cli' | 'mobile';
export type FeaturePackageTier = 'free' | 'paid' | 'enterprise';
export type FeaturePackageDomain = 'base' | 'software-development' | string;
export type FeatureRolloutStatus = 'active' | 'preview' | 'hidden' | 'deprecated';
export type FeaturePackageDistributionMode = 'bundled' | 'installable' | 'remote-service';
export type FeaturePackageSecurityBoundary = 'none-client-bundled' | 'signed-local-bundle' | 'server-enforced';
export type FeaturePackageInstallState =
  | 'bundled'
  | 'not-owned'
  | 'owned-not-installed'
  | 'installed'
  | 'update-available'
  | 'install-failed'
  | 'remote-service';
export type AccountSessionStatus = 'guest' | 'signed-in';
export type AccountSubscriptionStatus = 'free' | 'active' | 'trialing' | 'past-due' | 'canceled' | 'enterprise';
export type PurchaseStatus = 'paid' | 'trial' | 'refunded' | 'failed';
export type FeatureEntitlementState =
  | 'available'
  | 'trial'
  | 'locked'
  | 'expired'
  | 'unsupported'
  | 'disabled';

export type FeaturePackageExtensionPoint =
  | 'desktop.primary-nav'
  | 'desktop.child-route'
  | 'desktop.main-view'
  | 'desktop.right-panel'
  | 'desktop.status-bar'
  | 'desktop.slash-command'
  | 'electron.menu'
  | 'cli.command'
  | 'mobile.view'
  | 'settings.section';

export interface FeaturePackagePricing {
  amountCents: number;
  currency: 'USD' | string;
  interval?: 'one-time' | 'month' | 'year';
  label: string;
}

export interface AccountPaymentMethod {
  id: string;
  type: 'card';
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  createdAt: string;
}

export interface AccountPurchaseRecord {
  id: string;
  packageId: string;
  productSku: string;
  amountCents: number;
  currency: string;
  paymentMethodId: string;
  status: PurchaseStatus;
  purchasedAt: string;
}

export interface FeaturePackageArtifact {
  artifactId: string;
  version: string;
  distributionMode: FeaturePackageDistributionMode;
  bundlePath?: string;
  downloadUrl?: string;
  sha256?: string;
  signature?: string;
  signingKeyId?: string;
  installedPath?: string;
  installedAt?: string;
}

export interface FeaturePackageInstallRecord {
  packageId: string;
  artifactId: string;
  version: string;
  state: FeaturePackageInstallState;
  installedPath?: string;
  installedAt?: string;
  sha256?: string;
  signature?: string;
  error?: string;
}

export interface FeatureShellAdapter {
  shell: FeatureShell;
  routes?: string[];
  commands?: string[];
  views?: string[];
  settingsSections?: string[];
  notes?: string;
}

export interface FeatureDefinition {
  id: string;
  capabilityIds: string[];
  title: string;
  description: string;
  adapters: FeatureShellAdapter[];
  requiredServices?: string[];
  storageNamespaces?: string[];
  toolSchemas?: string[];
  automationTemplates?: string[];
  permissionPolicies?: string[];
  historyEventTypes?: string[];
}

export interface EntitlementRule {
  state: FeatureEntitlementState;
  reason: string;
  accountTiers?: string[];
  purchasedPackageIds?: string[];
  localOverrideKeys?: string[];
}

export interface FeaturePackageEntrypoints {
  runtime?: string;
  desktop?: string;
  renderer?: string;
  electron?: string;
  cli?: string;
  services?: string;
  mobile?: string;
}

export interface FeaturePackageSdkRequirement {
  name: string;
  versionRange: string;
}

export interface FeaturePackageExtensionRegistration {
  id: string;
  point: FeaturePackageExtensionPoint;
  shell: FeatureShell;
  featureId?: string;
  capabilityIds?: string[];
  title: string;
  description?: string;
  icon?: string;
  order?: number;
  route?: string;
  parentRoute?: string;
  childRoute?: string;
  command?: string;
  commandAliases?: string[];
  menuPath?: string[];
  statusKind?: string;
  entrypoint?: string;
  metadata?: Record<string, unknown>;
}

export interface FeaturePackageManifest {
  id: string;
  productSku: string;
  displayName: string;
  domain: FeaturePackageDomain;
  tier: FeaturePackageTier;
  version: string;
  owner: string;
  description: string;
  pricing: FeaturePackagePricing;
  dependencies: string[];
  minimumAppVersion: string;
  supportedShells: FeatureShell[];
  rolloutStatus: FeatureRolloutStatus;
  sdk?: FeaturePackageSdkRequirement;
  entrypoints?: FeaturePackageEntrypoints;
  distribution: {
    mode: FeaturePackageDistributionMode;
    artifact: FeaturePackageArtifact;
    installRequired: boolean;
    securityBoundary: FeaturePackageSecurityBoundary;
    notes: string;
  };
  entitlement: EntitlementRule;
  features: FeatureDefinition[];
  extensions?: FeaturePackageExtensionRegistration[];
  migration: {
    schemaVersion: number;
    compatibilityKey: string;
    renamedFrom?: string[];
  };
}

export interface FeatureEntitlementProfile {
  accountStatus?: AccountSessionStatus;
  accountId?: string;
  email?: string;
  displayName?: string;
  accountTier?: 'free' | 'paid' | 'enterprise' | string;
  subscriptionStatus?: AccountSubscriptionStatus;
  purchasedPackageIds?: string[];
  trialPackageIds?: string[];
  expiredPackageIds?: string[];
  disabledPackageIds?: string[];
  localDeveloperOverride?: boolean;
  enterprisePackageIds?: string[];
  installedPackageIds?: string[];
  packageInstallRecords?: FeaturePackageInstallRecord[];
  paymentMethods?: AccountPaymentMethod[];
  purchases?: AccountPurchaseRecord[];
  updatedAt?: string;
}

export interface FeatureAvailability {
  packageId: string;
  featureId: string;
  state: FeatureEntitlementState;
  reason: string;
  manifest: FeaturePackageManifest;
  feature: FeatureDefinition;
}

export interface FeaturePackageExtensionAvailability {
  packageId: string;
  featureId?: string;
  state: FeatureEntitlementState;
  reason: string;
  manifest: FeaturePackageManifest;
  extension: FeaturePackageExtensionRegistration;
}

export interface FeaturePackageResolution {
  shell: FeatureShell;
  profile: Required<FeatureEntitlementProfile>;
  packages: Array<{
    manifest: FeaturePackageManifest;
    state: FeatureEntitlementState;
    reason: string;
    installState: FeaturePackageInstallState;
    installReason: string;
  }>;
  features: FeatureAvailability[];
  extensions: FeaturePackageExtensionAvailability[];
}

export interface FeaturePackageLogger {
  debug(message: string, details?: Record<string, unknown>): void;
  info(message: string, details?: Record<string, unknown>): void;
  warn(message: string, details?: Record<string, unknown>): void;
  error(message: string, details?: Record<string, unknown>): void;
}

export interface FeaturePackageRuntimeContext {
  shell: FeatureShell;
  packageRoot: string;
  manifest: FeaturePackageManifest;
  logger: FeaturePackageLogger;
  registerExtension(extension: FeaturePackageExtensionRegistration): void;
}

export interface FeaturePackageActivationResult {
  registeredExtensions?: FeaturePackageExtensionRegistration[];
}

export interface FeaturePackageRuntimeModule {
  packageId: string;
  version: string;
  activate(context: FeaturePackageRuntimeContext): FeaturePackageActivationResult | Promise<FeaturePackageActivationResult>;
  deactivate?(): void | Promise<void>;
}

export function defineFeaturePackageManifest<T extends FeaturePackageManifest>(manifest: T): T {
  return manifest;
}

export function defineFeaturePackageRuntime<T extends FeaturePackageRuntimeModule>(runtime: T): T {
  return runtime;
}
