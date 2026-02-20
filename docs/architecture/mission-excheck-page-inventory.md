# Mission + Excheck Page Inventory

Source: `docs/architecture/R3AKT_Domain_Class_Diagram.mmd`  
Assumption: **Excheck** maps to the checklist domain (`checklist`, `checklistTask`, `CheckListtemplate`).

## Main Business Objects (from class diagram)

### Mission domain
- `Mission`
- `MissionChange`
- `LogEntry`
- `Team`
- `TeamMember`
- `ClientProfile`
- `Asset`
- `Zone` / `ZonePoint`
- `MissionRde`

### Excheck domain
- `checklist`
- `checklistTask`
- `checklistColumn`
- `CheckListtemplate`
- `MissionTaskAssignment`
- `TaskSkillRequirement`
- `Skill`
- `TeamMemberSkill`

## Required Pages

| Page | Primary objects | Purpose |
|---|---|---|
| Mission Directory | `Mission` | Browse/search missions, including mission hierarchy (`parent`/`children`). |
| Mission Create/Edit | `Mission`, `missionStatus`, `missionRoleList` | Create missions and manage mission metadata, roles, status, access, and lifecycle fields. |
| Mission Overview | `Mission`, `MissionChange`, `LogEntry` | Single mission summary with current state, priority/context fields, and recent activity. |
| Mission Team & Members | `Team`, `TeamMember`, `ClientProfile`, `MissionRde` | Manage teams, members, roles, callsigns, and member profiles for the mission. |
| Mission Assets | `Asset`, `AssetStatus` | Track mission/team assets, status, serials, location, and notes. |
| Mission Map & Zones | `Zone`, `ZonePoint` | Create/update operational zones tied to mission planning/execution. |
| Mission Activity / Audit | `MissionChange`, `LogEntry`, `MissionChangeType` | Full audit trail of mission changes and log entries. |
| Excheck Template Library | `CheckListtemplate`, `checklist`, `checklistColumn` | List, create, clone, update, and retire checklist templates. |
| Excheck Template Builder | `checklistColumn`, `checklistTask`, `checklistColumnType` | Define checklist schema (columns), default tasks, and task structure. |
| Mission Excheck Board | `Mission`, `checklist`, `checklistStatus` | Manage all checklists attached to a mission and their execution state. |
| Excheck Run Detail | `checklist`, `checklistTask`, `checklistTaskStatus` | Execute checklist runs: update task status, notes, due/completion times, and row data. |
| Task Assignment Workspace | `MissionTaskAssignment`, `TeamMember`, `Asset`, `TaskSkillRequirement`, `Skill`, `TeamMemberSkill` | Assign tasks to people/assets and validate assignment readiness against skill requirements. |
| Excheck Import / Offline Sync | `checklist`, `checklistTask` | Support offline checklist creation/import and upload/sync flows. |
| Excheck Publish to Mission Feed | `checklist`, `Mission` | Publish checklist outcomes/snapshots into mission feeds/topics. |
| Excheck Progress & Compliance | `checklist`, `checklistTask`, `MissionTaskAssignment` | Progress monitoring (pending/late/complete), accountability, and completion metrics. |

## Coverage Notes

- `Mission` has a direct association to `checklist` (`Mission "1" --> "0..*" checklist`), so mission and excheck views must be linked in navigation.
- `checklistTask` associations to `MissionTaskAssignment`, `TeamMember`, `Asset`, and `TaskSkillRequirement` require a dedicated assignment page, not just inline task editing.
- `MissionChange` and `LogEntry` are separate objects; both should be exposed in activity/audit UX.
