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

export interface FeatureAutomationSkill {
  id: string;
  name: string;
  description: string;
  path: string;
  content: string;
}

/** A package-defined actor that can execute one step in a host-managed workflow. */
export interface FeatureAutomationActor {
  id: string;
  name: string;
  role: string;
  goal: string;
  model?: string;
  tools: string[];
}

/**
 * Package-neutral workflow definition persisted and scheduled by the host.
 * Packages decide what the actors mean (for example, a software delivery team).
 */
export interface FeatureAutomationWorkflow {
  id: string;
  providerId?: string;
  name: string;
  objective: string;
  workspacePath?: string;
  permissionMode?: 'supervised' | 'full-access';
  maxIterations?: number;
  /** Opaque package-owned workflow configuration. The host persists and forwards it unchanged. */
  providerConfig?: Record<string, unknown>;
  supervisorId: string;
  members: FeatureAutomationActor[];
}

/** @deprecated Use FeatureAutomationActor. Retained for package API compatibility. */
export type FeatureAutomationTeamMember = FeatureAutomationActor;
/** @deprecated Use FeatureAutomationWorkflow. Retained for package API compatibility. */
export type FeatureAutomationTeamBlueprint = FeatureAutomationWorkflow;

export interface FeatureAutomationAssignment {
  id: string;
  title: string;
  description: string;
  memberId: string;
  memberName: string;
  role: string;
  dependencies: string[];
  parallelGroup: number;
  kind?: string;
  workspaceMode?: 'isolated' | 'shared';
  requiresArtifact?: boolean;
  requiresNonDocumentationArtifact?: boolean;
  goalIds?: string[];
  acceptanceCriteria?: string[];
  expectedArtifacts?: string[];
  producedArtifacts?: string[];
  workspacePath?: string;
  status: 'pending' | 'running' | 'succeeded' | 'failed';
  startedAt?: number;
  completedAt?: number;
  output?: string;
  error?: string;
}

export interface FeatureAutomationRunStep {
  memberId: string;
  memberName: string;
  role: string;
  assignmentId?: string;
  assignmentTitle?: string;
  status: 'running' | 'succeeded' | 'failed';
  output?: string;
  error?: string;
}

export interface FeatureAutomationRun {
  id: string;
  workflowId: string;
  workflowName: string;
  /** @deprecated Persisted compatibility field. Use workflowId. */
  teamId?: string;
  /** @deprecated Persisted compatibility field. Use workflowName. */
  teamName?: string;
  objective: string;
  status: 'running' | 'succeeded' | 'failed';
  assignments?: FeatureAutomationAssignment[];
  steps: FeatureAutomationRunStep[];
}

export interface FeatureAutomationPlannerContext {
  workspacePath: string;
  enabledSkills: FeatureAutomationSkill[];
  attempt: number;
  maxAttempts: number;
  validationFailure?: string;
}

export interface FeatureAutomationMemberContext {
  runId: string;
  workspacePath: string;
  enabledSkills: FeatureAutomationSkill[];
  assignment: FeatureAutomationAssignment;
  previousSteps: FeatureAutomationRunStep[];
  sharedSteps: FeatureAutomationRunStep[];
  attempt: number;
  maxAttempts: number;
  verificationFailure?: string;
}

export interface FeatureAutomationRunPreparationContext {
  workspacePath: string;
}

export interface FeatureAutomationAssignmentPreparationContext {
  workspacePath: string;
  dependencyOutputs: FeatureAutomationRunStep[];
}

export interface FeatureAutomationArtifactContext {
  workspacePath: string;
  assignment: FeatureAutomationAssignment;
}

/** Evidence collected by the host after an automation actor reports completion. */
export interface FeatureAutomationAssignmentValidationContext {
  workspacePath: string;
  output: string;
  /**
   * Machine-readable completion data submitted through the host's structured
   * finish tool. Providers should prefer this over parsing control records out
   * of user-facing prose.
   */
  completionRecord?: Record<string, unknown>;
  producedArtifacts: string[];
  dependencyOutputs: FeatureAutomationRunStep[];
}

/** Package-owned policy for a professional automation workflow. The host only executes this plan. */
export interface FeaturePackageAutomationProvider {
  id: string;
  createDefaultWorkflow?(objective: string, workspacePath: string): Partial<FeatureAutomationWorkflow>;
  /** @deprecated Implement createDefaultWorkflow instead. */
  createDefaultTeam?(objective: string, workspacePath: string): Partial<FeatureAutomationTeamBlueprint>;
  prepareRun?(
    workflow: FeatureAutomationWorkflow,
    run: FeatureAutomationRun,
    context: FeatureAutomationRunPreparationContext,
  ): void | Promise<void>;
  prepareAssignment?(
    workflow: FeatureAutomationWorkflow,
    run: FeatureAutomationRun,
    assignment: FeatureAutomationAssignment,
    context: FeatureAutomationAssignmentPreparationContext,
  ): void | Promise<void>;
  /**
   * Package-owned workflow metadata that must not count as a delivered artifact.
   * Paths are relative to the assignment workspace. The host treats every other
   * changed file as a candidate deliverable without knowing package conventions.
   */
  internalArtifactPaths?(context: FeatureAutomationArtifactContext): string[];
  buildPlannerPrompt(workflow: FeatureAutomationWorkflow, context: FeatureAutomationPlannerContext): string;
  parseAssignmentPlan(content: string, workflow: FeatureAutomationWorkflow): FeatureAutomationAssignment[];
  validateAssignmentPlan(workflow: FeatureAutomationWorkflow, assignments: FeatureAutomationAssignment[]): string | undefined;
  createFallbackAssignmentPlan?(workflow: FeatureAutomationWorkflow, maxIterations: number): FeatureAutomationAssignment[];
  buildMemberPrompt(
    workflow: FeatureAutomationWorkflow,
    actor: FeatureAutomationActor,
    context: FeatureAutomationMemberContext,
  ): string;
  /**
   * Package-owned completion gate. The host invokes this after its filesystem
   * checks and before promoting isolated assignment artifacts.
   */
  validateAssignmentCompletion?(
    workflow: FeatureAutomationWorkflow,
    run: FeatureAutomationRun,
    assignment: FeatureAutomationAssignment,
    context: FeatureAutomationAssignmentValidationContext,
  ): string | undefined | Promise<string | undefined>;
  validateCompletedRun?(
    workflow: FeatureAutomationWorkflow,
    run: FeatureAutomationRun,
  ): string | undefined | Promise<string | undefined>;
}

export interface FeaturePackageRuntimeContext {
  shell: FeatureShell;
  packageRoot: string;
  manifest: FeaturePackageManifest;
  logger: FeaturePackageLogger;
  registerExtension(extension: FeaturePackageExtensionRegistration): void;
  registerAutomationProvider(provider: FeaturePackageAutomationProvider): void;
}

export interface FeaturePackageActivationResult {
  registeredExtensions?: FeaturePackageExtensionRegistration[];
  registeredAutomationProviderIds?: string[];
}

/** CLI entrypoint exported by a feature package runtime bundle. */
export interface FeaturePackageCliModule {
  runCliCommand(command: string, args: string): Promise<string>;
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
