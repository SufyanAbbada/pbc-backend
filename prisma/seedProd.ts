import generateSlug from "../src/utils/nameToSlugConverter";
import {
  Category,
  PrismaClient,
  User,
  Article,
  BusinessGroup,
} from "@prisma/client";
import { hashPassword } from "../src/utils/passwordHandler";
import { faker } from "@faker-js/faker";
import { MembershipCategory, RoleId } from "../src/common/enums";

const prisma = new PrismaClient();

// Parse command line arguments
const args = process.argv.slice(2);
const selectedModules =
  args.length > 0 ? args.map((arg) => arg.toLowerCase()) : ["rolepermissions"];

async function seedDatabase() {
  console.log(
    `Starting seed with selected modules: ${selectedModules.join(", ")}`,
  );

  const shouldSeed = (module: string) => {
    return selectedModules.includes("all") || selectedModules.includes(module);
  };

  // ROLES AND PERMISSIONS
  let dbRoles: Record<string, number> = {};
  const roles = [
    "Individual",
    "Corporate",
    "PBC Staff",
    "Admin",
    "Chairman",
    "General Secretary",
    "VC Finance",
    "Director",
    "Job Applicant",
  ];
  if (shouldSeed("roles")) {
    await prisma.role.deleteMany();

    for (const role of roles) {
      const r = await prisma.role.create({ data: { name: role } });
      dbRoles[role] = r.id;
    }
    console.log(`Created ${roles.length} roles`);
  } else {
    dbRoles = (await prisma.role.findMany()).reduce(
      (acc, role) => {
        acc[role.name] = role.id;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  // ACTIONS
  let dbActions: Record<string, number> = {};
  if (shouldSeed("actions")) {
    console.log("Seeding actions...");
    await prisma.action.deleteMany();

    const actions = ["create", "read", "update", "delete", "manage", "approve"];

    for (const action of actions) {
      const a = await prisma.action.create({ data: { name: action } });
      dbActions[action] = a.id;
    }
    console.log(`Created ${actions.length} actions`);
  } else {
    dbActions = (await prisma.action.findMany()).reduce(
      (acc, action) => {
        acc[action.name] = action.id;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  // ROLE PERMISSIONS
  if (shouldSeed("rolepermissions")) {
    console.log("Seeding role permissions...");
    await prisma.rolePermission.deleteMany();

    const subjects = [
      "Address",
      "Cart",
      "Category",
      "Constitution",
      "ConstitutionApproval",
      "Discount",
      "JobApplication",
      "JobCategory",
      "JobSkill",
      "Lead",
      "Membership",
      "MembershipApproval",
      "MembershipRegistration",
      "Order",
      "Product",
      "Profile",
      "Quote",
      "RFQ",
      "Role",
      "RolePermission",
      "Transaction",
      "TransactionCategory",
      "User",
      "Ticket",
      "TicketCategory",
      "TicketResponse",
      "Policy",
      "Election",
      "EventApproval",
      "Vote",
      "Wishlist",
      "Task",
      "Attendance",
      "ActivityLog",
      "BusinessGroup",
    ];

    const assignPermissions = async (
      role: string,
      perms: { action: string; subject: string; permission?: string }[],
    ) => {
      for (const { action, subject, permission = "can" } of perms) {
        await prisma.rolePermission.create({
          data: {
            roleId: dbRoles[role],
            actionId: dbActions[action],
            subject,
            permission,
          },
        });
      }
    };

    await assignPermissions("Chairman", [{ action: "manage", subject: "all" }]);

    const directorRoles = [
      "Chairman",
      "General Secretary",
      "VC Finance",
      "Director",
    ];
    for (const role of directorRoles) {
      const perms = [
        ...(role === "Director"
          ? [
              { action: "create", subject: "Task" },
              { action: "read", subject: "Task" },
              { action: "update", subject: "Task" },
              { action: "delete", subject: "Task" },
              { action: "create", subject: "Event" },
              { action: "update", subject: "Event" },
            ]
          : [{ action: "read", subject: "Task" }]),
        { action: "read", subject: "Attendance" },
        { action: "manage", subject: "Constitution", permission: "cannot" },
        { action: "create", subject: "Attendance", permission: "cannot" },
        { action: "update", subject: "Attendance", permission: "cannot" },
        { action: "delete", subject: "Attendance", permission: "cannot" },
        { action: "manage", subject: "Membership" },
        { action: "manage", subject: "Product" },
        { action: "manage", subject: "RFQ" },
        { action: "manage", subject: "Quote" },
        { action: "read", subject: "User" },
        { action: "create", subject: "User" },
        { action: "update", subject: "User" },
        { action: "delete", subject: "User" },
        { action: "approve", subject: "User" },
        { action: "approve", subject: "Wishlist" },
        { action: "read", subject: "Wishlist" },
        { action: "read", subject: "ActivityLog" },
        { action: "create", subject: "ActivityLog" },
        { action: "read", subject: "Event" },
        { action: "manage", subject: "Role", permission: "cannot" },
        { action: "manage", subject: "RolePermission", permission: "cannot" },
      ];

      for (const subject of subjects) {
        if (
          subject !== "Role" &&
          subject !== "RolePermission" &&
          subject !== "Attendance" &&
          subject !== "Task" &&
          subject !== "Wishlist" &&
          subject !== "ActivityLog"
        ) {
          for (const action of ["create", "read", "update", "delete"]) {
            if (
              subject === "Lead" &&
              (action === "create" || action === "delete")
            ) {
              continue;
            } else if (subject === "Constitution" && action === "create")
              continue;
            perms.push({ action, subject });
          }
        }
      }
      await assignPermissions(role, perms);
    }

    for (const role of ["PBC Staff", "Admin"]) {
      const perms = subjects
        .map((subject) =>
          ["create", "read", "update", "delete"].map((action) => {
            if (
              subject === "Task" &&
              action !== "read" &&
              action !== "update"
            ) {
              return { action, subject, permission: "cannot" };
            }
            if (
              subject === "Lead" &&
              (action === "create" || action === "delete")
            ) {
              return { action, subject, permission: "cannot" };
            }
            if (subject === "Wishlist" && action !== "read") {
              return { action, subject, permission: "cannot" };
            }
            if (subject === "Constitution" && action === "create")
              return { action, subject, permission: "cannot" };
            return { action, subject };
          }),
        )
        .flat();
      await assignPermissions(role, perms);
    }

    for (const role of ["Individual", "Corporate"]) {
      const ownPerms = [
        "Address",
        "Cart",
        "Discount",
        "Membership",
        "Order",
        "Product",
        "Quote",
        "RFQ",
        "Profile",
        "Ticket",
        "Wishlist",
      ];

      const perms: { action: string; subject: string; permission?: string }[] =
        ownPerms.flatMap((subject) =>
          subject === "Order"
            ? [
                { action: "create", subject },
                { action: "read", subject },
              ]
            : subject === "Membership"
              ? [
                  { action: "create", subject },
                  { action: "read", subject },
                  { action: "update", subject },
                ]
              : [
                  { action: "create", subject },
                  { action: "read", subject },
                  { action: "update", subject },
                  { action: "delete", subject },
                ],
        );

      perms.push(
        { action: "manage", subject: "Category", permission: "cannot" }, // order of permission matters
        { action: "manage", subject: "Role", permission: "cannot" },
        { action: "manage", subject: "User", permission: "cannot" },
        {
          action: "manage",
          subject: "MembershipRegistration",
          permission: "cannot",
        },
        { action: "read", subject: "MembershipRegistration" },
        { action: "create", subject: "MembershipRegistration" },
        { action: "read", subject: "User" },
        { action: "create", subject: "User" },
        { action: "update", subject: "User" },
        { action: "delete", subject: "User" },
        { action: "manage", subject: "EventApproval", permission: "cannot" },
        { action: "read", subject: "Constitution" },
        { action: "read", subject: "Category" },
        { action: "read", subject: "Election" },
        { action: "create", subject: "Vote" },
        { action: "read", subject: "TicketResponse" },
        { action: "create", subject: "TicketResponse" },
        { action: "read", subject: "JobCategory" },
        { action: "read", subject: "JobSkill" },
        { action: "read", subject: "Policy" },
        { action: "read", subject: "TicketCategory" },
        { action: "read", subject: "TransactionCategory" },
        { action: "create", subject: "ActivityLog" },
        { action: "read", subject: "Event" },
        { action: "create", subject: "JobPost" },
        { action: "update", subject: "JobPost" },
        { action: "read", subject: "JobPost" },
        { action: "read", subject: "BusinessGroup" },
      );

      await assignPermissions(role, perms);
    }

    await assignPermissions("Job Applicant", [
      { action: "create", subject: "Profile" },
      { action: "read", subject: "JobPost" },
      { action: "create", subject: "JobApplication" },
    ]);

    for (const role of directorRoles) {
      await assignPermissions(role, [
        { action: "approve", subject: "MembershipApproval" },
        { action: "approve", subject: "Membership" },
        { action: "approve", subject: "Transaction" },
        { action: "update", subject: "Wishlist" },
        { action: "create", subject: "JobPost" },
        { action: "update", subject: "JobPost" },
        { action: "read", subject: "JobPost" },
        { action: "read", subject: "EventActionPoint" },
        { action: "update", subject: "EventActionPoint" },
        { action: "create", subject: "Initiative" },
        { action: "read", subject: "Initiative" },
        { action: "update", subject: "Initiative" },
        { action: "delete", subject: "Initiative" },
        { action: "create", subject: "BusinessGroup" },
        { action: "update", subject: "BusinessGroup" },
        { action: "delete", subject: "BusinessGroup" },
        { action: "create", subject: "EventActionPoint" },
        { action: "update", subject: "EventActionPoint" },
        { action: "delete", subject: "EventActionPoint" },
        { action: "create", subject: "EventAttendance" },
        { action: "update", subject: "EventAttendance" },
        { action: "delete", subject: "EventAttendance" },
      ]);
    }

    await assignPermissions("Admin", [
      { action: "approve", subject: "MembershipApproval" },
      { action: "approve", subject: "User" },
      { action: "approve", subject: "Wishlist" },
      { action: "update", subject: "Task" },
      { action: "approve", subject: "Discount" },
      { action: "read", subject: "ActivityLog" },
      { action: "create", subject: "ActivityLog" },
      { action: "create", subject: "JobPost" },
      { action: "update", subject: "JobPost" },
      { action: "read", subject: "JobPost" },
      { action: "create", subject: "Event" },
      { action: "update", subject: "Event" },
      { action: "read", subject: "Event" },
      { action: "read", subject: "EventActionPoint" },
      { action: "update", subject: "EventActionPoint" },
      { action: "create", subject: "BusinessGroup" },
      { action: "update", subject: "BusinessGroup" },
      { action: "delete", subject: "BusinessGroup" },
      { action: "create", subject: "EventActionPoint" },
      { action: "update", subject: "EventActionPoint" },
      { action: "delete", subject: "EventActionPoint" },
      { action: "create", subject: "EventAttendance" },
      { action: "update", subject: "EventAttendance" },
      { action: "delete", subject: "EventAttendance" },
      { action: "create", subject: "Initiative" },
      { action: "update", subject: "Initiative" },
      { action: "delete", subject: "Initiative" },
    ]);

    await assignPermissions("PBC Staff", [
      { action: "approve", subject: "User" },
      { action: "approve", subject: "Wishlist" },
      { action: "update", subject: "Task", permission: "cannot" },
      { action: "approve", subject: "Discount" },
      { action: "read", subject: "ActivityLog" },
      { action: "create", subject: "ActivityLog" },
      { action: "create", subject: "JobPost" },
      { action: "update", subject: "JobPost" },
      { action: "read", subject: "JobPost" },
      { action: "read", subject: "Event" },
      { action: "read", subject: "EventActionPoint" },
      { action: "update", subject: "EventActionPoint" },
      { action: "create", subject: "BusinessGroup" },
      { action: "update", subject: "BusinessGroup" },
      { action: "delete", subject: "BusinessGroup" },
      { action: "create", subject: "EventActionPoint" },
      { action: "update", subject: "EventActionPoint" },
      { action: "delete", subject: "EventActionPoint" },
      { action: "create", subject: "EventAttendance" },
      { action: "update", subject: "EventAttendance" },
      { action: "delete", subject: "EventAttendance" },
      { action: "create", subject: "Initiative" },
      { action: "update", subject: "Initiative" },
      { action: "delete", subject: "Initiative" },
    ]);

    for (const role of roles) {
      await assignPermissions(role, [
        { action: "create", subject: "Search", permission: "cannot" },
        { action: "update", subject: "Search", permission: "cannot" },
        { action: "delete", subject: "Search", permission: "cannot" },
        { action: "manage", subject: "Search", permission: "cannot" },
        { action: "approve", subject: "Search", permission: "cannot" },
        { action: "read", subject: "Search" },
        { action: "read", subject: "BusinessGroup" },
        { action: "read", subject: "EventActionPoint" },
        { action: "read", subject: "EventAttendance" },
        { action: "read", subject: "Initiative" },
      ]);
    }

    for (const role of roles) {
      if (role === "Job Applicant") continue;

      await assignPermissions(role, [
        { action: "read", subject: "Chat", permission: "cannot" },
        { action: "update", subject: "Chat", permission: "cannot" },
        { action: "delete", subject: "Chat", permission: "cannot" },
        { action: "manage", subject: "Chat", permission: "cannot" },
        { action: "approve", subject: "Chat", permission: "cannot" },
        { action: "create", subject: "Chat" },
      ]);
    }

    await assignPermissions("Chairman", [
      { action: "create", subject: "Wishlist", permission: "cannot" },
      { action: "update", subject: "Wishlist", permission: "cannot" },
      { action: "delete", subject: "Wishlist", permission: "cannot" },
      { action: "approve", subject: "Wishlist" },
      { action: "create", subject: "Event" },
      { action: "update", subject: "Event" },
      { action: "create", subject: "Task", permission: "cannot" },
      { action: "update", subject: "Task", permission: "cannot" },
      { action: "delete", subject: "Task", permission: "cannot" },
    ]);

    console.log("Role permissions seeding completed");
  }

  // USERS
  if (shouldSeed("users")) {
    console.log("Seeding users...");
    await prisma.user.deleteMany();

    const users: User[] = [];
    const roles = [
      "Individual",
      "Corporate",
      "PBC Staff",
      "Admin",
      "Chairman",
      "General Secretary",
      "VC Finance",
      "Director",
      "Job Applicant",
    ];

    const dbRoles = await prisma.role.findMany();
    const roleIdMap: Record<string, number> = {};
    dbRoles.forEach((role) => {
      roleIdMap[role.name] = role.id;
    });

    const adminEmails = [
      "admin1@admin.com",
      "admin2@admin.com",
      "admin3@admin.com",
      "admin4@admin.com",
      "admin5@admin.com",
      "admin6@admin.com",
      "admin7@admin.com",
      "admin8@admin.com",
    ];

    for (const role of roles) {
      if (role === "Job Applicant" || role === "Admin") {
        continue;
      }
      for (let i = 1; i <= 2; i++) {
        const email = `${role.toLowerCase().replace(/\s+/g, "")}${i}@pbc.com`;

        const user = await prisma.user.create({
          data: {
            name: faker.person.fullName(),
            email,
            password: await hashPassword("Test1234*"),
            phoneNumber: faker.phone.number({ style: "international" }),
            isActive: true,
            isEnabled: true,
            isContactsVerfied: true,
            isProfileVerified: true,
            isMembershipVerified: true,
            roleId: roleIdMap[role],
          },
        });
        users.push(user);
      }
    }

    const directorRoleCycle = [
      "Chairman",
      "General Secretary",
      "VC Finance",
      "Director",
    ];

    for (let i = 0; i < adminEmails.length; i++) {
      const email = adminEmails[i];
      const existing = await prisma.user.findFirst({ where: { email } });

      if (!existing) {
        let name = `Admin ${i + 1}`;

        const user = await prisma.user.create({
          data: {
            name,
            email,
            password: await hashPassword("Test1234*"),
            phoneNumber: faker.phone.number({ style: "international" }),
            isActive: true,
            isEnabled: true,
            isContactsVerfied: true,
            isProfileVerified: true,
            isMembershipVerified: true,
            roleId: RoleId.ADMIN,
          },
        });
        users.push(user);
      }
    }

    console.log(`Created ${users.length} users`);

    // PROFILES
    if (shouldSeed("profiles")) {
      console.log("Seeding profiles...");
      await prisma.profile.deleteMany();

      for (let i = 0; i < users.length; i++) {
        if (!users[i].isProfileVerified) continue;

        await prisma.profile.create({
          data: {
            userId: users[i].id,
            bio: i % 2 !== 0 ? faker.lorem.sentence() : null,
            country: faker.location.countryCode(),
            bioVideo: `https://www.youtube.com/watch?v=${faker.string.uuid()}`,
            facebookSocial:
              i % 2 === 0
                ? `https://facebook.com/${faker.internet.userName()}`
                : null,
            linkedInSocial:
              i % 2 === 0
                ? `https://linkedin.com/in/${faker.internet.userName()}`
                : null,
            calendlyLink:
              i % 2 === 0
                ? `https://calendly.com/${faker.internet.userName()}`
                : null,
            profilePicture:
              i % 3 !== 0
                ? `https://randomuser.me/api/portraits/men/${i}.jpg`
                : null,
            tradeLicense: `https://picsum.photos/600/400?random=${i + 1}`,
            passport: `https://picsum.photos/600/400?random=${i + 16}`,
            emiratesId: `https://picsum.photos/600/400?random=${i + 31}`,
            latitude:
              i % 2 !== 0
                ? parseFloat(faker.location.latitude().toFixed(6))
                : null,
            longitude:
              i % 2 !== 0
                ? parseFloat(faker.location.longitude().toFixed(6))
                : null,
          },
        });
      }

      console.log(`Created profiles for users`);
    }
  }

  // CATEGORIES
  if (shouldSeed("categories")) {
    console.log("Seeding categories...");
    await prisma.category.deleteMany();

    const categories: Category[] = [];
    const categoriesList = [
      "Advertising",
      "Insurance",
      "Automotive Manufacturers",
      "Multinational Companies",
      "Bottled Water",
      "Nursery",
      "Building Materials",
      "Retail",
      "Car Rental",
      "Steel",
      "Circular Packaging Association",
      "Supply Chain & Logistics",
      "Cloud Computing",
      "The Electronics",
      "Dubai Car Dealers",
      "The Events",
      "Dubai Community Pharmacies",
      "UAE Food & Beverage Manufacturers",
      "Dubai Computer Traders",
      "UAE Pharma",
      "Dubai Construction Industry",
      "UAE Restaurants",
      "Dubai Council For Marine and Maritime Industries",
      "Used Cars Showrooms",
      "Dubai Council for Wooden Ships",
      "Dubai Renewable Energy",
      "Dubai Digital Asset D2A2",
      "Dubai Travel & Tour Agents",
      "Dubai Healthcare",
      "Education",
      "Emirates Environmental",
      "FinTech & Payments",
      "Foreign Exchange and Remittance",
    ];
    for (let i = 0; i < categoriesList.length; i++) {
      const category = await prisma.category.create({
        data: {
          name: categoriesList[i],
          slug: await generateSlug(categoriesList[i]),
          description: faker.lorem.paragraph(),
        },
      });
      categories.push(category);
    }

    console.log(`Created ${categories.length} categories`);
  }

  // BUSINESS GROUPS
  if (shouldSeed("businessgroups")) {
    console.log("Seeding business groups...");
    await prisma.businessGroup.deleteMany();

    const businessGroups = [
      "Advertising Business Group",
      "Automotive Manufacturers Business Group",
      "Bottled Water Business Group",
      "Building Materials Business Group",
      "Car Rental Business Group",
      "Circular Packaging Association Business Group",
      "Cloud Computing Business Group",
      "Dubai Car Dealers Business Group",
      "Dubai Community Pharmacies Business Group",
      "Dubai Computer Traders Group",
      "Dubai Construction Industry Business Group",
      "Dubai Council For Marine and Maritime Industries",
      "Dubai Council for Wooden Ships",
      "Dubai Digital Asset D2A2",
      "Dubai Healthcare Business Group",
      "Dubai Renewable Energy Business Group",
      "Dubai Travel & Tour Agents Business Group",
      "Education Business Group",
      "Emirates Environmental Group",
      "FinTech & Payments Business Group",
      "Foreign Exchange and Remittance Group",
      "Fruits & Vegetables Business Group",
      "Insurance Business Group",
      "Multinational Companies Business Group",
      "Nursery Business Group",
      "Retail Business Group",
      "Steel Business Group",
      "Supply Chain & Logistics Group",
      "The Electronics Business Group",
      "The Events Group",
      "UAE Food & Beverage Manufacturers Group",
      "UAE Pharma Business Group",
      "UAE Restaurants Group",
      "Used Cars Showrooms Business Group",
    ];

    const createdBusinessGroups: BusinessGroup[] = [];

    for (const businessGroup of businessGroups) {
      const createdGroup = await prisma.businessGroup.create({
        data: {
          name: businessGroup,
          description: faker.lorem.paragraph(),
        },
      });
      createdBusinessGroups.push(createdGroup);
    }

    console.log(`Created ${createdBusinessGroups.length} business groups`);

    // MEMBERSHIPS
    if (shouldSeed("memberships") && shouldSeed("users")) {
      console.log("Seeding memberships...");
      await prisma.membership.deleteMany();

      const users = await prisma.user.findMany({
        where: { isMembershipVerified: true },
        take: 15,
      });

      for (let i = 0; i < users.length; i++) {
        await prisma.membership.create({
          data: {
            userId: users[i].id,
            emiratesId: faker.string.uuid(),
            dateOfBirth: faker.date.past({ years: 30 }),
            passportNumber: faker.string.uuid(),
            passportExpiryDate: faker.date.future({ years: 5 }),
            emiratesIdExpiryDate: faker.date.future({ years: 3 }),
            companyName: faker.company.name(),
            city: faker.location.city(),
            country: faker.location.country(),
            tradeLicenseNumber: faker.string.alphanumeric(10).toUpperCase(),
            tradeLicenseExpiry: faker.date.future({ years: 3 }),
            emiratesIssuingAuthority: faker.company.buzzPhrase(),
            yearOfEstablishment: faker.number.int({ min: 1980, max: 2023 }),
            affiliation: faker.company.buzzPhrase(),
            legalStatus: faker.company.buzzAdjective(),
            natureOfBusiness: faker.company.catchPhrase(),
            businessGroup: { connect: { id: createdBusinessGroups[i].id } },
            noOfEmployees: faker.number.int({ min: 1, max: 500 }),
            vatRegistrationNumber: faker.string.alphanumeric(12).toUpperCase(),
            hsCodes: faker.lorem.words(5).split(" "),
            website: faker.internet.url(),
            keywords: faker.lorem.words(5).split(" "),
            shareHolderStatus: faker.helpers.arrayElement(["Single", "Joint"]),
            otherShareHoldersName: faker.lorem.words(5).split(" "),
            annualRevenue: faker.finance.amount({
              min: 100,
              max: 1000000,
              dec: 2,
            }),
            ownershipPercentage: faker.number.int({ min: 1, max: 100 }),
            references: faker.lorem.words(5).split(" "),
            professionalTitle: faker.person.jobTitle(),
            primeClients: faker.lorem.words(5).split(" "),
            languagesSpoken: faker.lorem.words(5).split(" "),
            yearsOfExperience: faker.number.int({ min: 1, max: 30 }),
            expectations: faker.lorem.sentence(),
            keyObjectives: faker.lorem.words(5).split(" "),
            areaOfInterest: faker.lorem.words(5).split(" "),
            selfDescription: faker.lorem.paragraph(),
            membershipCategory: MembershipCategory.CATEGORY_A,
            councilDiscoveryMethod: faker.helpers.arrayElement([
              "Online",
              "Referral",
              "Event",
            ]),
            businessTrainingInterest: faker.helpers.arrayElement(["YES", "NO"]),
            clientIntroductionComfort: faker.helpers.arrayElement([
              "YES",
              "NO",
            ]),
            status:
              i % 3 === 0 ? "APPROVED" : i % 2 === 0 ? "PENDING" : "REJECTED",
          },
        });
      }

      console.log(`Created memberships for users`);
    }
  }

  // CONSTITUTION AND ARTICLES
  if (shouldSeed("constitution")) {
    console.log("Seeding constitution and articles...");
    await prisma.article.deleteMany();
    await prisma.constitution.deleteMany();

    const constitution = await prisma.constitution.create({
      data: {
        title: "Articles of Association",
      },
    });

    const articles: Article[] = [];
    const articlesData = [
      {
        title: "ARTICLE 1 - DEFINITIONS",
        htmlContent:
          "<p>The definitions contained in the Regulations Organizing Business Councils of Dubai Chambers shall apply to the meanings and terms contained in these Articles of Association.</p>",
      },
      {
        title: "ARTICLE 2 - NAME AND PREMISES",
        htmlContent:
          "<p>This Business Councils is called (Pakistan Business) non-profit Council, which shall have the legal personality and legal capacity necessary to carry out activities and actions that achieve its objectives, and shall has its premises in the Emirate of Dubal, this Councils operates under the umbrella and supervision of Dubai Chambers in accordance with the Regulations Organizing Business Councils of Dubal Chambers.</p>",
      },
      {
        title: "ARTICLE 3 - COUNCILS OBJECTIVES",
        htmlContent:
          "<p>The objectives of the Council are as follows:</p><ul><li>To promote the development of commerce and investment between the United Arab Emirates and Pakistan.</li><li>To be direct liaison with Dubai Chamber of Commerce, various Chambers of Commerce of Pakistan and other chambers of commerce and business organizations worldwide, and to express the views of the local Pakistan business community to public and private interests in Pakistan.</li><li>To provide a forum in which Pakistani business executives in Dubai and elsewhere in the United Arab Emirates and business executives with Pakistani interests may identify, discuss and pursue commercial common interests regarding their activities.</li><li>To work with individuals and organizations in Dubai and other Emirates on commercial matters of mutual interest.</li><li>To heighten awareness of Dubai's commercial position in the Middle East among the Pakistan business.</li></ul>",
      },
      {
        title: "ARTICLE 4 - MEMBERSHIP CATEGORIES",
        htmlContent:
          "<p>a. Companies/Organizations Membership: Companies and organizations with a valid license to operate in the State, including freezones' companies and establishments and special development zones.</p><p>b. Individual Membership: Any Business owners and experts belonging to a certain nationality who is interested in furthering the objectives of the Council given that they:</p><ol><li>have not been convicted of a felony or any crime that affects their honor and integrity.</li><li>is not declared bankrupt prior to joining the Council unless he was reinstated.</li><li>have full legal capacity in accordance to the applicable laws in the state.</li><li>This membership may not be assigned or transferred to others.</li></ol><p>c. Honorary Membership: Government Entities and public personalities. government officials whether active or retired in the State, diplomatic personnel, any other personalities in recognition of their extraordinary or meritorious services. This membership is exempted from paying membership fees in accordance with the terms and conditions of Dubai Chambers.</p><p>d. Council's Board of Directors may approve any member to join the Council if it deems appropriate by a majority of votes.</p>",
      },
      {
        title: "ARTICLE 5 - MEMBERSHIP APPLICATIONS AND FEES",
        htmlContent:
          "<p>a. Applications to join the Council membership shall be addressed to the Council Board of Directors who shall, by simple majority vote, accept the applicant member if their forms and other requirements are deemed to be in order. Applicants shall complete the approved application form and shall provide the Council Board of Directors with any other information that it may deem appropriate.</p><p>b. Once approved and once the membership fees have been paid, the membership shall be valid for a period of one year renewable for subsequent yearly periods upon payment of the annual membership fees.</p><p>c. The annual membership fee for the first year of establishment of the Council is set at AED (1,500) ((*) United Arab Emirates Dirhams), said amount shall be paid within (30 Days) from the date of the approval of membership application, the fee shall be deposit into the Council designated bank account. The annual membership fee for every subsequent year shall be established by the Council Board of Directors and paid within the timeframe specified by the Council Board of Directors.</p><p>d. Any Member fails to pay the applicable Council membership fee within the time frame, the Council Board of Directors shall send a reminder to the concerned Member who shall have a grace period of 30 Days (Thirty days ). to rectify his/her position and make the payment. Failure to pay after such period shall; entail invalidation of the membership and the Member shall be accordingly notified.</p>",
      },
      {
        title: "ARTICLE 6 - LOSS AND FORFEITURE OF COUNCIL MEMBERSHIP",
        htmlContent:
          "<p>a. A member shall either lose or forfeit the Council membership in any of the following cases:</p><ol><li>Death of an individual member.</li><li>Inability to perform his/her duties or loss of capacity due to any of the impediments to legal capacity as established by the applicable laws.</li><li>If a Individual member is convicted of any crime Involving his/her honesty and Integrity.</li><li>If a member declares his/her bankruptcy or ceased to pay his/her debts, even if it is not accompanied by declaring his/her bankruptcy.</li><li>Cessation of the legal status of the Council.</li><li>Dissolution or liquidation of the legal entity of the corporate member.</li><li>Loss or cancelation of commercial/professional license of the corporate member.</li><li>Non-payment of membership fees.</li><li>If a member did not adhere to perform his/her duties or the general principles of good faith or rules of conduct or confidentiality or non-conflict of interest or anti-fraud.</li><li>If a Council member submits documents containing false information to Dubai Chambers or concealing Important information from Dubai Chambers.</li><li>Termination in accordance with the decision of the General Assembly following a recommendation from the Council Board of Directors.</li><li>If a member requests to be relieved from his duties by virtue of a written notice.</li></ol><p>b. If the Council whether in its Ordinary General Assembly Meeting or an Extraordinary Assembly Meeting considers that the conduct of one of the Council members is injurious to the objectives and interests of the Council, the Council Board of Directors shall, upon instructions of the General Assembly. terminate the Member's membership effective immediately. The quorum and majority required by the Assembly to adopt such resolution shall be as established in Article 7 of the Council's Articles of Association.</p><p>c. The cancelled membership may be re-instated if the Council Board of Directors, at its discretion and by simple majority vote, decides that there are reasons to believe that the situation or conduct that gave rise to the resignation or cancellation will be corrected.</p>",
      },
      {
        title: "ARTICLE 7 - GENERAL ASSEMBLY MEETINGS",
        htmlContent:
          "<p>a. The general assembly meeting shall be comprised of all Members who satisfy membership requirements and have paid their membership fees prior to the general assembly meeting.</p><p>b. The general assembly meeting shall be held at least once a year within the first 3 (three) months following the end of its financial year in person and/or by means of virtual communication, upon a written invitation from the Chairman to the contact details given to the Council Board of Directors upon submission of Council membership application. The invitation shall be sent at least (21) twenty-one days prior to the date set for holding the meeting and (30) thirty days at the most and attaching a meeting agenda including the topics to be discussed. In case a quorum is not met, the meeting shall be adjourned for (30) thirty minutes, after which if there is no quorum, then those present shall constitute a quorum, except for the first General Assembly Meeting of the Council which needs to meet the quorum requirements set out in these Articles of Association.</p><p>c. The quorurn for a Council general assembly meeting shall be (50%) fifty percent of the voting members and (1) one Member.</p><p>d. The fixed agenda of the Council general assembly meeting is:</p><ol><li>Sharing and approving the annual report of the Council.</li><li>Sharing the audit report of the previous financial year.</li><li>Approving the financial statement of the prior financial year.</li><li>Adopting the budget for the upcoming financial year.</li><li>Appointing new auditors.</li><li>Any other issue proposed by the voting members and approved by the meeting chairperson may be added to the agenda.</li></ol><p>e. Corporate members shall have 2 votes. The company may appoint two of its employees as a representative in the Council, such appointment shall be in writing, any of the representatives or both can be replaced by written notice at any time during the validity of the membership without additional fees. a proxy may be appointed from the same representatives for voting on its behalf only at the Council meetings. The written proxy shall be submitted by the delegated member to the meeting chairperson at the beginning of the Council meetings, provided that the delegate shall not act as a proxy of more than (2) two members at any meeting.</p><p>f. The individual and professional members may delegate others to represent his in the Council meeting, any individual and professional member shall be entitled for one vote.</p><p>g. Approval of resolutions shall be adopted with majority votes of the Members present and represented by proxy.</p>",
      },
      {
        title: "ARTICLE 8 - COUNCIL EXTRAORDINARY GENERAL ASSEMBLY MEETINGS",
        htmlContent:
          "<p>a. Extraordinary General Assembly may be called by a request from at least (75%) seventy-five percent of the Council Board of Directors and/or more than (50%) fifty percent of the General Assembly Members with voting rights.</p><p>b. The Chairman shall announce the request for an Extraordinary General Assembly Meeting within (7) seven days from the date of receiving the request attaching a meeting agenda including the topics to be discussed and whether the meeting will be in person or by virtual means. However, the Extraordinary General Assembly Meeting shall be held between (14) fourteen days and (21) twenty-one days after the announcement.</p><p>c. The quorum for an Extraordinary General Assembly Meeting shall be (75%) seventy five percent of the voting Members.</p><p>d. In case a quorum is not met, the Extraordinary General Assembly Meeting will be adjourned for (7) seven days. If, at the subsequent meeting at least (20%) twenty percent of Members are in attendance, that shall be sufficient to form quorum. If that second meeting is still not quorate, then the meeting will again be adjourned for another (7) seven days and those present shall constitute a quorum.</p>",
      },
      {
        title: "ARTICLE 9 - MEMBERS VOTING RIGHTS",
        htmlContent:
          "<p>a. Each Individual Member has (1) one vole, and each corporate Member has a maximum of (2) two votes.</p><p>b. In case of an equality of votes, a second round of voting shall take place. If equality of votes is obtained again, the meeting Chairperson shall have the casting vote.</p><p>c. In case of virtual meetings, the Council Board of Directors may call the online voting with at least (15) fifteen days and at most (30) thirty days' notice. The quorum for any online voting shall be (75%) seventy five percent of the voting Members. Each Member votes only once and no proxy to another Member is accepted.</p><p>d. Only those Members who have a valid membership and settled their membership fees as specified in the Articles of Associations are eligible to vote during any Council Meetings.</p>",
      },
      {
        title: "ARTICLE 10 - COUNCIL BOARD OF DIRECTORSCOMPOSITION",
        htmlContent:
          "<p>a. The General Assembly shall elect among its Members a Council Board of Directors consisting of no less than (5) five and not more than (9) nine Members. The names of the nominated Members shall be provided to the Dubai Chambers in advance of the Meeting. In the event of resignation or termination by a member of the Council Board of Directors, the Council Board of Directors shall notify the Dubai Chambers. If the Council Board of Directors Members reduce in number to less than (5) five, then elections for a new Board Member should be held within (30) thirty days thereof.</p><p>b. The members of the Council Board of Directors shall elect the Chairman, Vice-Chairman, if required, a Secretary General and any other position. The Vice-Chairman can assume all the duties of the Chairman if deputized by the Chairman or in case of the absence of the Chairman.</p><p>c. The Council Board of Directors shall consist of the following:</p><ol><li>At least (50%) fifty percent of businesses licensed in the Emirate.</li><li>At least C-Level management representing their companies. Equivalent management positions, for corporate members of Category (A) including but not limited to General Managers and Managing Directors, are permitted provided these are approved by the Dubai Chambers.</li><li>The Chairman must represent a business licensed in the Emirate.</li><li>In case the term of the Chairman ends, he/she must serve at least (3) three months on the Council Board of Directors as a transition period to ensure a smooth handover and he must continue in his tenure until the election of a new Chairman of the Council Board.</li></ol><p>d. The new Chairman of the Council Board of Directors must be elected within a period not exceeding (3) three months form the date of the end of the Chairman's tenure.</p><p>e. The term of the Council Board of Directors membership should not exceed (2) two consecutive terms, each term consisting of (2) two years, Including Chairman and Vice-Chairman. A third term for the Council Board of Directors membership is permitted provided the following:</p><ol><li>the consent of (75%) seventy-five percent of the Council Members is obtained; and</li><li>the successful self-evaluation of the performance of the Council Board of Directors based on KPIs set by the Council Board of Directors from time to time.</li></ol>",
      },
      {
        title:
          "ARTICLE 11 - LOSS AND FORFEITURE OF COUNCIL BOARD OF DIRECTORS MEMBERSHIP",
        htmlContent:
          "<p>a. The member of the Council Board of Directors shall lose and forfeit his membership in any of the following cases:</p><ol><li>Death.</li><li>Inability to perform the duties or loss of capacity due to any of the impediments to legal capacity as established by law.</li><li>Resignation by written notice to the Council Board of Directors.</li><li>If such member of the Council Board of Directors fails to attend (2) two consecutive meetings of the Council Board of Directors during its term without an excuse acceptable by the Council Board of Directors.</li><li>If such member of the Council Board of Directors did not adhere to perform his/her duties or the general principles of good faith or rules of conduct or confidentiality or non-conflict of interest or anti-fraud.</li></ol><p>b. The vacant seat in the Council Board of Directors shall be filled as stipulated in Article 10 of these Articles of Association.</p>",
      },
      {
        title: "ARTICLE 12 - COUNCIL BOARD OF DIRECTORS DUTIES",
        htmlContent:
          "<p>a. The Council Board of Directors shall have the following tasks and powers:</p><ol><li>Fulfil the objectives desired from founding the Council to enhance business network, bilateral economic relations. interests, and knowledge sharing.</li><li>Adopt the Council's strategic, developmental, operational, and financial plans, and overseeing their implementation.</li><li>Perform all functions specified in these Articles of Association.</li><li>Develop the vision, mission, strategic objectives, and propose action plans to be approved by the General Assembly of the Council and communicate it accordingly.</li><li>Organize a minimum number of events, trainings and workshops as set out and approved by the Council Board.</li><li>To jointly wark with Dubai Chambers to implement a mechanism to grow the membership base and expand the Council.</li><li>Form Council Board of Directors Committees as it sees fit, whether at the Council Board level or at its Members' level, headed by a Board Member.</li><li>Review these Articles of Association at least once every (5) five years and propose necessary amendments if required.</li><li>Liaise between the Council and Dubai Chambers and present the issues and proposals requiring consideration by the Government Entities to Dubai Chambers for Intervention and assistance to resolve the same.</li><li>Discuss the issues referred to it by Dubai Chambers and provide recommendations thereto.</li><li>Engage in Dubai Chambers advocacy activities through participation in surveys, studies, meetings, events, and other activities.</li><li>Submit to Dubai Chambers at least once a year the challenges facing the sector and propose recommendations and solutions.</li><li>Adopt a succession plan to ensure the sustainability of the Council.</li><li>Appoint authorized signatories for bank accounts and determining their powers by virtue of a signatory matrix; noting that a minimum of two (2) Council Board of Directors members are needed to operate the account(s).</li></ol><p>b. Any other tasks necessary to achieve objectives of the Council assigned to it by Dubai Chambers</p>",
      },
      {
        title: "ARTICLE 13 - DUTIES OF THE CHAIRMAN",
        htmlContent:
          "<p>The chairman shall assume the following tasks and powers:</p><ol><li>Representing the Council before federal and local Government Entities and international entities.</li><li>Convening the Council Board of Directors Meetings, approving the agenda of the meetings and approving their minutes, signing the resolutions adopted by the Council Board of Directors, and supervising their Implementation.</li><li>Calling for General Assembly Meetings and chairing those meetings.</li><li>Overseeing the preparation of reports and proposals on the affairs and matters of the Council and submitting them to Dubai Chambers.</li><li>Any other tasks or powers necessary to achieve the objectives of the Council assigned to it by the Council Board of Directors.</li></ol>",
      },
      {
        title: "ARTICLE 14 - COUNCIL BOARD OF DIRECTORS MEETINGS",
        htmlContent:
          "<p>a. The Council Board of Directors shall hold a minimurn of (4) four meetings annually.</p><p>b. The meetings of the Council Board of Directors shall be convened upon an invitation by its Chairman sent a minimum of (10) ten days before the planned meeting.</p><p>c. If the meetings of the Council Board of Directors are not convened for (6) six consecutive months, Dubai Chambers shall call the Council Board of Directors for a meeting and if no response is received within (15) fifteen days, Dubai Chambers shall request Council's general assembly to elect a new Council Board of Directors.</p><p>d. The quorum for the Council Board of Directors shall be half of the Members and (1) one Member.</p>",
      },
      {
        title: "ARTICLE 15 - COUNCIL BOARD OF DIRECTORS RESOLUTIONS",
        htmlContent:
          "<p>a. Resolutions shall be issued by a simple majority of the Council Board of Directors, and each Member of the Council Board of Directors shall have one vote. In the event of a tie, the Chairman shall have the casting vote.</p><p>b. The resolutions shall be considered effective from the date of their issuance unless they specify a later date for their Implementation.</p><p>c. The Council Board of Directors may in urgent cases, issue some of its resolutions by circulation. Such resolutions shall be considered valid and effective as if they had been taken in a convened and duly held meeting, taking into account the following:</p><ol><li>The approval of the Council Board of Directors Members by the majority that the situation requiring the issuance of the resolution by circulation is urgent.</li><li>A written resolution must be submitted to all Council Board of Directors Members for approval, accompanied by all documents required for its review.</li><li>All resolutions passed by circulation must be approved by a majornity in writing and must be presented at the next meeting to be included in the minutes of the meeting.</li></ol>",
      },
      {
        title: "ARTICLE 16 - CONFLICT OF INTEREST",
        htmlContent:
          "<p>a. Each Member of the Council Board of Directors, during the term of the membership and during the performance of his tasks as a Member of the Council Board of Directors, must avoid any conflict that may arise between his personal interests and the interests of the Council, and avoid any action that might raise any doubt of a conflict of interest, and must take the necessary measures and steps to avoid becoming involved in a conflict of interest.</p><p>b. The Member of the Council Board of Directors must disclose in advance any conflict of interest or suspicion thereof, and any previous conflict or current conflict or potential conflict or the emergence of a conflict must be disclosed at all times.</p><p>c. In case of conflict of interest, said member of the Council Board of Directors shall not participate in the voting on the decision issued in this regard, if proven otherwise, the relevant vote shall be excluded and the legal quorum shall be reconsidered to adopt the resolution or its invalidity, and this shall be recorded in the minutes of the following meeting.</p><p>d. All Council members shall adhere to competition laws and regulations. Furthermore, Council members are prohibited from engaging in conduct that may be deemed by Dubai Chambers as unfair competition in the Council's respective sector.</p>",
      },
      {
        title: "ARTICLE 17 - CONFIDENTIALITY",
        htmlContent:
          "<p>Each Member of the Council Board of Directors during the term of membership or in the event of loss or forfeiture or end of membership shall maintain the confidentiality of the Information of which they have become aware by virtue of their membership or because of it and shall not disclose or reveal the information, whether in writing or verbally.</p>",
      },
      {
        title: "ARTICLE 18 - LIABILITY",
        htmlContent:
          "<p>a. The Council's liability shall be limited exclusively to the extent of its own assets.</p><p>b. No Council member shall assume liability for any debt or obligation of the Council due to its Council membership.</p><p>c. Board of Directors members or members of the Council shall not be personally liable except for cases of intentional or gross negligence.</p>",
      },
      {
        title: "ARTICLE 19 - FUNDS AND FINANCIAL MATTERS",
        htmlContent:
          "<p>a. The Council shall:</p><ol><li>open a bank account in any State national bank deemed fit by the Council Board of Directors.</li><li>Prepare the budget and keep financial record of the Council as per the accounting standard.</li><li>issue annual financial statements which shall be prepared and audited by independent audit firms, in conformity with the Applicable Laws.</li><li>provide copy of the annual budget and financial records to Dubai Chambers</li></ol><p>b. The fiscal year of the Council shall begin on 1st of January and shall end on 31st of December of each calendar year.</p><p>c. The Council shall finance its operations mainly by:</p><ol><li>Annual membership fees.</li><li>Revenue from Events or other activities of the Council.</li></ol>",
      },
      {
        title: "ARTICLE 20 - FINANCIAL AUDITOR",
        htmlContent:
          "<p>a. The General Assembly shall appoint auditor(s) for a term of one renewable year provided that the auditor(s) elected shall serve for a maximum period of six (6) consecutive fiscal years from the date of assuming the audit thereof. The auditor(s) may be reassigned to audit the Council's accounts after the lapse of at least two (2) fiscal years from the date of the expiry of its appointment period.</p><p>b. The Council General Assembly shall determine the fees of the auditor(s),</p>",
      },
      {
        title: "ARTICLE 21 - BYLAWS",
        htmlContent:
          "<p>The Board of Directors may refer to the Regulations Organizing the Business Councils of Dubai Chambers for issues not stipulated in these Articles of Associations.</p>",
      },
      {
        title: "ARTICLE 22 - FINANCIAL AUDITOR", // * intended to be "APPLICABLE LAW AND DISPUTES"?
        htmlContent:
          "<p>a. Any disputes that may arise between any members of the Council, shall be settled amicably, in the event that an amicable solution is not possible, a vote to resolve the dispute shall be made by the majority of the Council's Board of Directors, and its decision in this regard shall be final.</p><p>b. These Articles of Associations shall be governed by the laws of the State. Dubai Courts shall have the jurisdiction to look into any dispute.</p>",
      },
    ];

    for (const articleData of articlesData) {
      const newArticle = await prisma.article.create({
        data: {
          title: articleData.title,
          content: articleData.htmlContent,
          constitutionId: constitution.id,
        },
      });
      articles.push(newArticle);
    }

    console.log(`Created constitution with ${articles.length} articles`);
  }

  console.log("Seed data creation completed");
}

// Display help if requested
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
  Usage: npm run seedProd -- [modules]
  
  Available modules:
    - roles: Seeds the roles table
    - actions: Seeds the actions table
    - rolepermissions: Seeds the role permissions table (default if no module specified)
    - profiles: Seeds profiles table
    - categories: Seeds categories table
    - businessgroups: Seeds business groups table
    - memberships: Seeds memberships table
    - constitution: Seeds constitution and articles tables
    - all: Seeds all tables
  
  Examples:
    npm run seedProd                  # Seeds only role permissions
    npm run seedProd -- all           # Seeds all tables
    npm run seedProd -- users profiles # Seeds users and profiles tables
  `);
  process.exit(0);
}

seedDatabase()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Database connection closed");
  });
