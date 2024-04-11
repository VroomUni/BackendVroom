const { Expo } = require("expo-server-sdk");

const sendPushNotifications = async (pushTokens, messageBody, data) => {
  // Create a new Expo SDK client
  let expo = new Expo({
    accessToken: process.env.EXPO_ACCESS_TOKEN,
    useFcmV1: false,
  });

  // Create the messages that you want to send to clients
  let messages = [];
  for (let pushToken of pushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    messages.push({
      to: pushToken,
      sound: "default",
      body: messageBody,
      data: data,
    });
  }

  // Chunk the messages
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];

  try {
    // Send the chunks of notifications
    for (let chunk of chunks) {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
    }
  } catch (error) {
    console.error("Error sending push notifications:", error);
    return;
  }

  // Retrieve receipts
  let receiptIds = tickets.filter(ticket => ticket.id).map(ticket => ticket.id);

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

  try {
    for (let chunk of receiptIdChunks) {
      let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
      console.log(receipts);

      for (let receiptId in receipts) {
        let { status, message, details } = receipts[receiptId];
        if (status === "ok") {
          continue;
        } else if (status === "error") {
          console.error(
            `There was an error sending a notification: ${message}`
          );
          if (details && details.error) {
            console.error(`The error code is ${details.error}`);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error retrieving push notification receipts:", error);
  }
};

module.exports= sendPushNotifications;
