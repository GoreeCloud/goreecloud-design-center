# Current Platform-System Non-Applicability — Development Scope

This record supports only the current `0.1.0-development` source boundary and must be re-evaluated when architecture or deployment changes.

## GoreeCloud Identity

The current Design Center runtime is a static reference workspace with no account creation, authentication, authorization, privileged operation, user-owned server data, device registration, credential handling, or session model. GoreeCloud Identity is therefore declared `not-applicable-justified` for this bounded Development runtime.

Identity becomes applicable if the product adds accounts, authenticated personalization, saved server-side workspaces, privileged administration, protected resources, delegated authority, device identity, or another identity-bearing capability.

## GoreeCloud Sync

The current Design Center runtime has no durable cross-device user dataset. The appearance selector may use local browser storage, but that local preference is not represented as GoreeCloud Sync and does not create a synchronization contract. GoreeCloud Sync is therefore declared `not-applicable-justified` for this bounded Development runtime.

Sync becomes applicable if the product adds saved design workspaces, user preferences intended to travel across devices, collaborative state, versioned user content, offline queues, or another durable synchronized dataset.
