export async function logEventsFromTx(sourceName: string, tx: any) {
  const receipt = await tx.wait();

  if (receipt.events) {
    console.log(`Events from : ${sourceName}:`);
    for (const event of receipt.events || []) {
      if (!event.event) continue;
      console.log(` * ${event.event} with args ${event.args}`);
    }
  }
  return tx;
}

// export async function logEventsFromTx(tx) {
//   const EventEmitter = await ethers.getContractFactory("EventEmitter");
//   const eventEmitter = await EventEmitter.deploy();
//   await eventEmitter.deployed();

//   const tx2 = await eventEmitter.emitBothEvents(42, "foo");

//   const receipt = await tx2.wait()

//   for (const event of receipt.events) {
//     console.log(`Event ${event.event} with args ${event.args}`);
//   }
// }
