-- CreateTable
CREATE TABLE "public"."Admin" (
    "idAdmin" SERIAL NOT NULL,
    "username" VARCHAR(70) NOT NULL,
    "email" VARCHAR(70) NOT NULL,
    "phone" VARCHAR(20),
    "password" VARCHAR(70) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("idAdmin")
);

-- CreateTable
CREATE TABLE "public"."Coproprietaire" (
    "idCopro" SERIAL NOT NULL,
    "nom" VARCHAR(70) NOT NULL,
    "email" VARCHAR(70) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "idAdmin" INTEGER NOT NULL,

    CONSTRAINT "Coproprietaire_pkey" PRIMARY KEY ("idCopro")
);

-- CreateTable
CREATE TABLE "public"."Charge" (
    "idCharge" SERIAL NOT NULL,
    "typeCharge" VARCHAR(70) NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "statut" VARCHAR(30) NOT NULL,
    "echeance" TIMESTAMP(3) NOT NULL,
    "idAdmin" INTEGER NOT NULL,

    CONSTRAINT "Charge_pkey" PRIMARY KEY ("idCharge")
);

-- CreateTable
CREATE TABLE "public"."Payer" (
    "idPayer" SERIAL NOT NULL,
    "idCharge" INTEGER NOT NULL,
    "idCopro" INTEGER,
    "datePaiement" TIMESTAMP(3),
    "montantPaye" DOUBLE PRECISION,

    CONSTRAINT "Payer_pkey" PRIMARY KEY ("idPayer")
);

-- CreateTable
CREATE TABLE "public"."Evenement" (
    "idEvent" SERIAL NOT NULL,
    "nomEvent" VARCHAR(70) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "lieu" VARCHAR(100) NOT NULL,
    "idAdmin" INTEGER NOT NULL,

    CONSTRAINT "Evenement_pkey" PRIMARY KEY ("idEvent")
);

-- CreateTable
CREATE TABLE "public"."Lot" (
    "idLot" SERIAL NOT NULL,
    "numeroLot" VARCHAR(20) NOT NULL,
    "etage" VARCHAR(10) NOT NULL,
    "taille" DOUBLE PRECISION NOT NULL,
    "type" VARCHAR(30),
    "idCopro" INTEGER,

    CONSTRAINT "Lot_pkey" PRIMARY KEY ("idLot")
);

-- CreateTable
CREATE TABLE "public"."Maintenance" (
    "idMaintenance" SERIAL NOT NULL,
    "probleme" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "priorite" VARCHAR(10),
    "statut" VARCHAR(20),
    "idAdmin" INTEGER NOT NULL,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("idMaintenance")
);

-- CreateTable
CREATE TABLE "public"."Maintenir" (
    "idLot" INTEGER NOT NULL,
    "idMaintenance" INTEGER NOT NULL,

    CONSTRAINT "Maintenir_pkey" PRIMARY KEY ("idLot","idMaintenance")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_phone_key" ON "public"."Admin"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Coproprietaire_email_key" ON "public"."Coproprietaire"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Coproprietaire_phone_key" ON "public"."Coproprietaire"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Lot_numeroLot_key" ON "public"."Lot"("numeroLot");

-- AddForeignKey
ALTER TABLE "public"."Coproprietaire" ADD CONSTRAINT "Coproprietaire_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "public"."Admin"("idAdmin") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Charge" ADD CONSTRAINT "Charge_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "public"."Admin"("idAdmin") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payer" ADD CONSTRAINT "Payer_idCharge_fkey" FOREIGN KEY ("idCharge") REFERENCES "public"."Charge"("idCharge") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payer" ADD CONSTRAINT "Payer_idCopro_fkey" FOREIGN KEY ("idCopro") REFERENCES "public"."Coproprietaire"("idCopro") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evenement" ADD CONSTRAINT "Evenement_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "public"."Admin"("idAdmin") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lot" ADD CONSTRAINT "Lot_idCopro_fkey" FOREIGN KEY ("idCopro") REFERENCES "public"."Coproprietaire"("idCopro") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Maintenance" ADD CONSTRAINT "Maintenance_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "public"."Admin"("idAdmin") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Maintenir" ADD CONSTRAINT "Maintenir_idLot_fkey" FOREIGN KEY ("idLot") REFERENCES "public"."Lot"("idLot") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Maintenir" ADD CONSTRAINT "Maintenir_idMaintenance_fkey" FOREIGN KEY ("idMaintenance") REFERENCES "public"."Maintenance"("idMaintenance") ON DELETE RESTRICT ON UPDATE CASCADE;
