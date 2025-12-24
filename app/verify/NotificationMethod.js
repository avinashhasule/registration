"use client";
import { NOTIFICATION_METHOD_LIST } from "@/utils/Constant";

export default function NotificationMethod({
  formData,
  setFormData,
  otpMessage,
}) {
  return (
    <div className="mt-4">
      <fieldset>
        <legend className="sr-only">Notification method</legend>
        <div className="flex items-center justify-center space-x-4">
          {NOTIFICATION_METHOD_LIST.map((notificationMethod) => (
            <div
              key={notificationMethod.id}
              className="relative flex items-center"
            >
              <input
                id={notificationMethod.id}
                name="notification-method"
                type="radio"
                value={notificationMethod.id}
                checked={
                  formData["notification-method"] === notificationMethod.id
                }
                onChange={() => {
                  if (otpMessage) return;
                  setFormData({
                    ...formData,
                    "notification-method": notificationMethod.id,
                  });
                }}
                className="relative rounded border-gray-300 text-blue-600"
              />
              <label
                htmlFor={notificationMethod.id}
                className="text-sm font-medium text-gray-700 ml-1 leading-6 cursor-pointer"
              >
                {notificationMethod.title}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
