"use client";

import React from "react";
import { RewardType, RewardStatus } from "@/domain/entities/reward";

export interface RewardBadgeProps {
  type: "status" | "type" | "value";
  status?: RewardStatus;
  rewardType?: RewardType;
  value?: string;
  className?: string;
}

export const RewardBadge: React.FC<RewardBadgeProps> = ({
  type,
  status,
  rewardType,
  value,
  className = "",
}) => {
  const getBadgeConfig = () => {
    if (type === "status" && status) {
      switch (status) {
        case RewardStatus.ACTIVE:
          return { class: "badge-success", text: "Active" };
        case RewardStatus.INACTIVE:
          return { class: "badge-neutral", text: "Inactive" };
        case RewardStatus.EXPIRED:
          return { class: "badge-error", text: "Expired" };
        case RewardStatus.EXHAUSTED:
          return { class: "badge-warning", text: "Exhausted" };
        default:
          return { class: "badge-neutral", text: status };
      }
    }

    if (type === "type" && rewardType) {
      switch (rewardType) {
        case RewardType.COUPON:
          return { class: "badge-primary", text: "Coupon" };
        case RewardType.DISCOUNT:
          return { class: "badge-secondary", text: "Discount" };
        case RewardType.FREE_ITEM:
          return { class: "badge-accent", text: "Free Item" };
        case RewardType.POINTS:
          return { class: "badge-info", text: "Points" };
        case RewardType.BADGE:
          return { class: "badge-warning", text: "Badge" };
        default:
          return { class: "badge-neutral", text: rewardType };
      }
    }

    if (type === "value" && value) {
      return { class: "badge-success badge-lg", text: value };
    }

    return { class: "badge-neutral", text: "Unknown" };
  };

  const config = getBadgeConfig();

  return (
    <div className={`badge ${config.class} ${className}`}>{config.text}</div>
  );
};
