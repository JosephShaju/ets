"use server";

import prisma from "@/lib/prisma";

// Create Author with Validation
export async function createAuthor(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const affiliation = formData.get("affiliation")?.toString().trim();

  // Validation: Name is required
  if (!name) {
    throw new Error("Name is required");
  }

  // Create author in database
  await prisma.author.create({
    data: {
      name,
      email: email || null,
      affiliation: affiliation || null,
    },
  });
}

// Create Paper with Validation
export async function createPaper(formData: FormData) {
  // Extract and sanitize input
  const title = formData.get("title")?.toString().trim();
  const publishedIn = formData.get("publishedIn")?.toString().trim();
  const yearStr = formData.get("year")?.toString().trim();
  const authorIdsRaw = formData.getAll("authorIds");

  // 1. Validate title
  if (!title) {
    throw new Error("Title is required");
  }

  // 2. Validate publication venue
  if (!publishedIn) {
    throw new Error("Publication venue is required");
  }

  // 3. Validate year
  if (!yearStr) {
    throw new Error("Publication year is required");
  }

  const year = parseInt(yearStr, 10);
  if (isNaN(year) || year <= 1900) {
    throw new Error("Valid year after 1900 is required");
  }

  // 4. Validate authors
  const authorIds = authorIdsRaw.map((id) => parseInt(id.toString(), 10));
  if (authorIds.length === 0 || authorIds.some((id) => isNaN(id))) {
    throw new Error("Please select at least one author");
  }

  // Create paper
  await prisma.paper.create({
    data: {
      title,
      publishedIn,
      year,
      authors: {
        connect: authorIds.map((id) => ({ id })),
      },
    },
  });
}
