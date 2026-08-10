# Restaurant Curation

This context describes how a User privately organizes Restaurants into Categories.

## Language

**User**:
A person who owns private Categories and the Restaurants within them.
_Avoid_: Account, member

**Category**:
A private grouping owned by exactly one User and the lifecycle owner of its Restaurants. Its name is unique among that User's Categories without regard to casing, accents, or insignificant whitespace.
_Avoid_: Tag, label

**Restaurant**:
A venue whose User ownership is derived from its Category. It belongs to exactly one Category at a time, may move only between Categories owned by the same User, and may share its name with other Restaurants.
_Avoid_: Place, establishment

**Unassigned Category**:
A Category created lazily for one User when Restaurants need a destination during Category deletion. Each User has at most one; it is displayed as `Sans catégorie`, and its Restaurants may move in or out, but it cannot be renamed or deleted.
_Avoid_: Uncategorized, orphaned Restaurants
