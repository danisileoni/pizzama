import { Schema } from 'mongoose';
import slugify from 'slugify';
import { Project } from 'src/projects/entities/project.entity';

const generateSlugMiddleware = function (this: Project, next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const project = this;
  if (project.isModified('name')) {
    project.slug = slugify(project.name, { lower: true, strict: true });
  }
  next();
};

const updateSlugMiddleware = function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }
  next();
};

export const generateSlug = function (schema: Schema<Project>) {
  schema.pre('save', generateSlugMiddleware);
  schema.pre('findOneAndUpdate', updateSlugMiddleware);
};
