# 3.9 DBaaS vs DIY

| Topic           | DBaaS                         | PostgreSQL + PVC                               |
|-----------------|-------------------------------|------------------------------------------------|
| Initial setup   | Easy                          | Complex                                        |
| Cost            | Separate managed DB cost      | Uses GKE nodes + persistent disk costs         |
| Maintenance     | Google handles most of things | User maintains PostgreSQL container and config |
| Backups         | Automated built-in backups    | You need to set up and manage backups yourself |
| Scalability     | Easy                          | Manual                                         |
| Overall control | Less low-level control        | More control over database and storage         |
| Recovery        | Built-in recovery options     | You need to handle recovery logic yourself     |

- DBaaS costs more for the managed service, but reduces the amount of work you need to do to maintain the database.
- DIY PostgreSQL can be cheaper and/or simpler for small setups, but requires more work to maintain and scale.
