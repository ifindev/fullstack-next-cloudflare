# Project Brief: Fullstack Next.js + Cloudflare CRM

**Created**: 2025-11-08
**Status**: Ready for Planning
**Purpose**: Learning exercise to understand Next.js 15 + Cloudflare Workers integration

---

## Vision

A lightweight CRM built on the fullstack-next-cloudflare template to learn modern fullstack patterns: Next.js App Router, Cloudflare D1/R2, Server Actions, and module-sliced architecture.

---

## Problem/Opportunity

**Learning objective**: Understand how to build production-grade features on Cloudflare's edge platform by implementing real-world CRM functionality.

**Why CRM as the learning vehicle**:
- Multi-entity relationships (contacts ↔ deals)
- CRUD operations with validation
- Data modeling with foreign keys
- UI patterns (lists, forms, boards)
- Follows existing architecture (todos module)

---

## Target Audience

- **Primary user**: You (Jez) - exploring the stack
- **Scale**: Single user for learning (no multi-tenancy needed)
- **Context**: Educational project, not production SaaS
- **Data**: Can use synthetic/test data

---

## Core Functionality (MVP)

### 1. Contacts Module
**Essential**:
- ✅ Create, read, update, delete contacts
- ✅ Fields: firstName, lastName, email, phone, company, jobTitle, notes
- ✅ Search/filter by name, email, company
- ✅ Tag system (many-to-many: contacts ↔ tags)
- ✅ User-specific tags with colors

**Deferred to Phase 2** (keep MVP lean):
- ❌ Activity timeline (calls, meetings, notes)
- ❌ Avatar uploads to R2
- ❌ Email integration
- ❌ Import/export

### 2. Deals/Pipeline Module
**Essential**:
- ✅ Create, read, update, delete deals
- ✅ Fields: title, value, currency, stage, expectedCloseDate, description
- ✅ Link deal to contact (simple 1:1 relationship)
- ✅ Pipeline board view (simple columns by stage)
- ✅ Fixed stages: Prospecting → Qualification → Proposal → Negotiation → Closed Won/Lost

**Deferred to Phase 2**:
- ❌ Custom user-defined stages
- ❌ Drag-and-drop stage changes
- ❌ Deal probability/forecasting
- ❌ Multiple contacts per deal

### 3. Dashboard Integration
**Essential**:
- ✅ Add navigation to /dashboard/contacts and /dashboard/deals
- ✅ Simple metrics cards (total contacts, active deals, pipeline value)

**Deferred**:
- ❌ Charts/graphs
- ❌ Activity feed
- ❌ Advanced analytics

---

## Tech Stack (Validated)

Uses existing template stack - no changes needed:

- **Frontend**: Next.js 15.4.6 (App Router) + React 19 + TypeScript
- **UI**: Tailwind v4 + shadcn/ui + Lucide icons
- **Backend**: Cloudflare Workers with Static Assets (@opennextjs/cloudflare)
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Storage**: Cloudflare R2 (not using for MVP - deferred avatars)
- **Auth**: Better Auth (already configured)
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Cloudflare Workers (via GitHub Actions)

**Why this stack works for learning**:
- ✅ Modern patterns (Server Actions, RSC)
- ✅ Edge-first architecture
- ✅ Type-safe end-to-end (TypeScript + Drizzle + Zod)
- ✅ Template already has auth, DB, migrations configured
- ✅ Follows module-sliced pattern (easy to extend)

---

## Research Findings

### Existing Template Analysis

**What's already built** (from /home/jez/Documents/fullstack-next-cloudflare-demo):
- ✅ **Auth module**: Better Auth with email/password + Google OAuth
- ✅ **Todos module**: Complete CRUD example with categories, priorities, status
- ✅ **Database setup**: D1 + Drizzle + migrations working
- ✅ **R2 integration**: Image upload pattern (in todos for cover images)
- ✅ **Module architecture**: `src/modules/[feature]/` with actions/, components/, schemas/
- ✅ **UI components**: 13 shadcn/ui components configured
- ✅ **Deployment**: GitHub Actions workflow ready

**Pattern to follow**:
The `src/modules/todos/` structure is the perfect blueprint:
```
todos/
├── actions/           # Server actions (create, get, update, delete)
├── components/        # UI components (form, card, list)
├── models/            # Enums and types
└── schemas/           # Drizzle + Zod schemas
```

We'll replicate this for `contacts/` and `deals/` modules.

### Technical Validation

**✅ D1 Relational Data**:
- Drizzle ORM supports foreign keys and joins
- Template already has `todos → categories` relationship
- Contacts ↔ Deals will work the same way

**✅ Many-to-Many Tags**:
- Need junction table: `contacts_to_tags`
- Drizzle example in their docs: https://orm.drizzle.team/docs/rqb#many-to-many

**✅ Server Actions Performance**:
- Template uses server actions for all mutations
- Edge runtime = fast globally
- No API route boilerplate needed

**Known Challenges**:
1. **Junction table queries** - Drizzle syntax for many-to-many can be verbose
   - Mitigation: Study existing `todos.categoryId` pattern, extend to junction table
2. **Pipeline board UI** - Kanban layout without drag-drop library
   - Mitigation: Simple CSS Grid columns, manual stage update dropdown (defer drag-drop to Phase 2)
3. **Search implementation** - D1 doesn't have full-text search
   - Mitigation: Use SQL `LIKE` queries for MVP (good enough for learning)

---

## Scope Validation

### Why Build This?
**Learning objectives met**:
- ✅ Practice module-sliced architecture
- ✅ Understand Drizzle ORM relationships (1:1, many-to-many)
- ✅ Learn Server Actions data mutation patterns
- ✅ Explore D1 migrations workflow
- ✅ Build complex forms with validation
- ✅ Create dashboard visualizations
- ✅ Deploy to Cloudflare edge

**Why NOT use existing CRM**:
- This is about learning the stack, not production use
- Building from scratch teaches architectural patterns
- Template provides 80% foundation (auth, DB, UI), we add 20% (domain logic)

### Why This Scope?
**MVP is deliberately minimal** to focus on learning core patterns:
- 2 main entities (contacts, deals) = practice relationships
- Tags system = practice many-to-many
- Pipeline board = practice UI state management
- Dashboard metrics = practice aggregations

**Deferred features** prevent scope creep:
- Activity logging (complex timeline UI)
- Avatars (R2 already demonstrated in todos)
- Custom stages (adds complexity)
- Advanced analytics (not core learning)

**Time investment** = ~6-8 hours (~6-8 minutes with Claude Code)
- Realistic for learning project
- Can complete in 1-2 sessions
- Leaves room for experimentation

### What Could Go Wrong?

**Risk 1: Overcomplicating relationships**
- *What*: Trying to add too many foreign keys (deals → contacts → companies → industries...)
- *Mitigation*: Stick to MVP scope (contacts ↔ tags, deals → contacts). No nested hierarchies.

**Risk 2: UI perfectionism**
- *What*: Spending hours on drag-and-drop Kanban, animations, etc.
- *Mitigation*: Use simple table/grid layouts. Focus on functionality, not polish.

**Risk 3: Scope creep during build**
- *What*: "While I'm here, let me add email integration..."
- *Mitigation*: Strict adherence to MVP checklist. Document ideas for Phase 2.

---

## Estimated Effort

**Total MVP**: ~6-8 hours (~6-8 minutes human time with Claude Code)

**Breakdown**:
- Setup (clone, configure D1, run migrations): 30 min
- Contacts module (schema, actions, UI, tags): 2.5 hours
- Deals module (schema, actions, UI, board): 2 hours
- Dashboard integration (nav, metrics): 1 hour
- Testing & seed data: 1 hour
- Documentation: 30 min

**Phase 2** (optional extensions):
- Activity timeline: +2 hours
- Avatar uploads: +1 hour
- Drag-drop Kanban: +2 hours
- Custom stages: +1.5 hours
- Advanced search: +2 hours

---

## Success Criteria (MVP)

**Functional Requirements**:
- [ ] Can create, edit, delete, search contacts
- [ ] Can assign multiple tags to contacts
- [ ] Can create tags with colors
- [ ] Can create, edit, delete deals
- [ ] Deals link to contacts (dropdown selector)
- [ ] Pipeline board shows deals in columns by stage
- [ ] Dashboard shows: total contacts, active deals, pipeline value
- [ ] All data isolated to logged-in user
- [ ] Forms have proper validation (Zod schemas)
- [ ] UI responsive on mobile/desktop

**Technical Requirements**:
- [ ] Follows module-sliced architecture (`src/modules/contacts/`, `src/modules/deals/`)
- [ ] Uses Server Actions (not API routes)
- [ ] Database migrations run successfully (local + production)
- [ ] Type-safe end-to-end (TypeScript + Drizzle + Zod)
- [ ] shadcn/ui components used consistently
- [ ] Deploys to Cloudflare Workers without errors

**Learning Objectives**:
- [ ] Understand how to structure multi-entity features
- [ ] Practice Drizzle ORM relationships (foreign keys, joins, many-to-many)
- [ ] Learn Server Actions patterns for CRUD
- [ ] Experience D1 migrations workflow
- [ ] Build complex forms with React Hook Form + Zod

---

## Next Steps

### If Proceeding (Recommended)

1. **Exit plan mode** and start implementation
2. **Clone project** to `/home/jez/Documents/fullstack-next-cloudflare-crm`
3. **Configure local Cloudflare**:
   - Create new D1 database: `npx wrangler d1 create fullstack-crm`
   - Update `wrangler.jsonc` with new database ID
   - Set up `.dev.vars` with Better Auth secrets
4. **Implement in phases**:
   - Phase 1: Project setup + database schema
   - Phase 2: Contacts module
   - Phase 3: Deals module
   - Phase 4: Dashboard integration
   - Phase 5: Testing & documentation
5. **Deploy when ready** (Cloudflare account setup)

### If Refining Scope

**Want simpler?**
- Skip tags (just contacts + deals)
- Skip pipeline board (simple table view)
- Reduces to ~4 hours

**Want more ambitious?**
- Add activity timeline
- Add R2 avatar uploads
- Add custom stages
- Increases to ~10-12 hours

---

## Research References

- **Template repo**: https://github.com/jezweb/fullstack-next-cloudflare (forked from ifindev)
- **Local codebase**: /home/jez/Documents/fullstack-next-cloudflare-demo
- **Drizzle ORM relationships**: https://orm.drizzle.team/docs/rqb
- **shadcn/ui components**: https://ui.shadcn.com/docs
- **Cloudflare D1 docs**: via `mcp__cloudflare-docs__search_cloudflare_documentation`
- **Relevant skills**: `~/.claude/skills/cloudflare-d1`, `~/.claude/skills/drizzle-orm-d1`

---

## Recommendation

✅ **Proceed with MVP implementation**

**Rationale**:
1. Scope is well-defined and realistic (6-8 hours)
2. Template provides solid foundation (80% already built)
3. Learning objectives are clear and achievable
4. No technical blockers (all patterns exist in template)
5. Can defer advanced features to Phase 2 without compromising learning

**This is an excellent learning project** - complex enough to teach real patterns, simple enough to complete without frustration.
