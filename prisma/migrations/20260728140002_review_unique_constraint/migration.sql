-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_dishId_key" ON "Review"("userId", "dishId");
