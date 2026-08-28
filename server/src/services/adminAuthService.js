import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import config from '../config/index.js';
import ApiError from '../utils/ApiError.js';
import { signAdminToken } from '../utils/jwt.js';

export const ensureDefaultAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || 'HANS Solar Admin';

  if (!email || !password) {
    console.warn(
      'ADMIN_EMAIL or ADMIN_PASSWORD not set — default admin account was not created.',
    );
    return;
  }

  const existingAdmin = await prisma.admin.findUnique({ where: { email } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.admin.create({
      data: { name, email, password: hashedPassword },
    });
    console.log(`Default admin account ready for ${email}`);
    return;
  }

  const passwordMatches = await bcrypt.compare(password, existingAdmin.password);

  if (!passwordMatches) {
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.admin.update({
      where: { email },
      data: { name, password: hashedPassword },
    });
    console.log(`Default admin credentials synced for ${email}`);
  }
};

export const loginAdmin = async ({ email, password }) => {
  if (!config.jwt.secret) {
    throw new ApiError(500, 'JWT secret is not configured on the server');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const admin = await prisma.admin.findUnique({
    where: { email: normalizedEmail },
  });

  if (!admin) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signAdminToken(admin.id);

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    },
  };
};
