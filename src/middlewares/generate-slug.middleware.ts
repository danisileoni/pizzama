import { Schema } from 'mongoose';
import slugify from 'slugify';
import { Project } from 'src/projects/entities/project.entity';

export const generateSlugMiddleware = async function (this: Project, next) {
  console.log('generando slug');
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  await next();
};

export const updateSlugMiddleware = async function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }
  await next();
};

export const generateSlug = function (schema: Schema<Project>) {
  schema.pre('save', generateSlugMiddleware);
  schema.pre('findOneAndUpdate', updateSlugMiddleware);
};
