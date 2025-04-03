import { Injectable, Scope } from '@nestjs/common';
import { PureAbility, AbilityBuilder } from '@casl/ability';
import { Subjects, createPrismaAbility, PrismaQuery } from '@casl/prisma'; // Subjects is a type that maps a subject to a resource. Like an object.
import { User, Post, Roles } from '@prisma/client';

export type PermActions = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type PermissionResource = Subjects<{ User: User; Post: Post }> | 'all';

export type AppAbility = PureAbility<
  [PermActions, PermissionResource],
  PrismaQuery
>;

export type DefinePermissions = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void;

const rolePermissionsMap: Record<Roles, DefinePermissions> = {
  // Record is a type that maps a key to a value. Like an object.
  ADMIN(user, { can }) {
    can('manage', 'all');
  },
  EDITOR(user, { can }) {
    can('create', 'Post');
    can('update', 'Post', { authorId: user.id });
    can('read', 'Post');
  },
  WRITER(user, { can }) {
    can('create', 'Post');
    can('read', 'Post');
    can('update', 'Post', { authorId: user.id });
  },
  READER(user, { can }) {
    can('read', 'Post', { published: true });
  },
};

@Injectable({ scope: Scope.REQUEST }) // scope is a type that determines the scope of the service. Like a singleton.
export class CaslAbilityService {
  ability: AppAbility;

  createForUser(user: User) {
    const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);
    rolePermissionsMap[user.role](user, builder);
    this.ability = builder.build();

    return this.ability;
  }
}
