# Wayward Mod Development Guidelines

## Required Documentation Checks

**ALWAYS check `node_modules/@wayward/` for official documentation before making any assumptions about Wayward APIs.**

### Primary Documentation Sources

1. **`node_modules/@wayward/types/README.md`** - Main modding guide with links to comprehensive wiki
2. **`node_modules/@wayward/types/definitions/game/`** - Complete TypeScript definitions for all game APIs
3. **[Wayward Types Viewer](https://waywardgame.github.io/)** - Searchable online documentation of all type definitions

### Critical API References

- **`node_modules/@wayward/types/definitions/game/IGlobal.d.ts`** - Global variables like `localPlayer`, `game`, `ui`
- **`node_modules/@wayward/types/definitions/game/event/`** - All available event buses and event types
- **`node_modules/@wayward/types/definitions/game/mod/`** - Mod registration, decorators, and mod lifecycle 
- **`node_modules/@wayward/types/definitions/game/ui/`** - Dialog system, UI components, and screen management
- **`node_modules/@wayward/types/definitions/game/renderer/`** - Rendering events and graphics APIs

## Development Patterns

### Event Handling
Use the decorator pattern with proper EventBus references:
```typescript
@EventHandler(EventBus.WorldRenderer, "renderOverlay")
protected onRenderOverlay(host: WorldRenderer, spriteBatch: ISpriteBatch): void {
    // Implementation
}
```

### Mod Registration
Check `node_modules/@wayward/types/definitions/game/mod/ModRegistry.d.ts` for all available registration decorators like `@Register.dialog`, `@Register.bindable`, etc.

### Type Safety
When Wayward APIs are incomplete in development, use prefixed placeholder interfaces to maintain architecture patterns while avoiding type conflicts.

## Troubleshooting Process

1. **Check the wiki first**: [Wayward Modding Guide](https://github.com/WaywardGame/types/wiki)
2. **Search type definitions**: Look in `node_modules/@wayward/types/definitions/` for the relevant API
3. **Verify event signatures**: Check event handler parameters in the type definitions
4. **Review working examples**: Check official mods at [Wayward GitHub](https://github.com/WaywardGame)

## Project-Specific Notes

- This project uses quality highlighting for Superior (blue) and Remarkable (purple) items
- Main rendering happens via WorldRenderer events for ground items
- Dialog system uses the `Register` default export pattern
- Keyboard input handling may use DOM events when full SDK is unavailable
