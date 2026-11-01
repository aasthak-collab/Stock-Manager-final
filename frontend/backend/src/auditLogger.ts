import prisma from "./prismaClient";

// This function is called from every route that makes a change
export const logAudit = async (
  action: string,      // e.g. "CREATE", "UPDATE", "DELETE"
  module: string,      // e.g. "STOCK", "SALES", "PURCHASE"
  details: string,     // e.g. "Added 100kg MS Pipe"
  userEmail?: string   // who did it
) => {
  try {
    await prisma.auditLog.create({
      data: { action, module, details, userEmail },
    });
  } catch (err) {
    // Never let audit logging break the main operation
    console.error("Audit log failed:", err);
  }
};