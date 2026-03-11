"use client";

import Button from "@/components/ui/CtaButton";
import { cldImage } from "@/lib/cloudinary";
import type { ID, MenuItem } from "@/types/menu";
import type { RamenSelection } from "@/types/ramen";
import { AlertCircle, Check } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { moneyFromCents } from "./helpers";

export type ItemConfig = RamenSelection;

type MenuOptionDTO = {
  id: ID;
  groupId: ID;
  name: string;
  description?: string | null;
  priceDeltaCents: number;
  imageUrl?: string | null;
  maxQty: number;
  defaultQty: number;
  sortOrder: number;
};

type MenuOptionGroupDTO = {
  id: ID;
  title: string;
  required: boolean;
  minSelected: number;
  maxSelected: number;
  sortOrder: number;
  options: MenuOptionDTO[];
};

type MenuItemDetailDTO = MenuItem & {
  optionGroups: MenuOptionGroupDTO[];
};

export default function MenuItemModal({
  open,
  item,
  onClose,
  onAdd,
}: {
  open: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onAdd: (item: MenuItem, qty: number, config: ItemConfig) => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !item) return null;

  return (
    <MenuItemModalInner
      key={item.id}
      item={item}
      onClose={onClose}
      onAdd={onAdd}
    />
  );
}

function MenuItemModalInner({
  item,
  onClose,
  onAdd,
}: {
  item: MenuItem;
  onClose: () => void;
  onAdd: (item: MenuItem, qty: number, config: ItemConfig) => void;
}) {
  const isRamen = item.kind === "ramen" || item.categoryId === "ramen";
  const panelH = isRamen ? "h-[88vh]" : "h-[70vh]";

  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  const [detail, setDetail] = useState<MenuItemDetailDTO | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedByGroup, setSelectedByGroup] = useState<Record<string, ID[]>>(
    {}
  );

  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      setLoading(true);
      setDetail(null);
      setSelectedByGroup({});
      setQty(1);
      setNote("");

      try {
        const res = await fetch(`/api/menu/items/${item.id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to load menu item ${item.id}`);
        }

        const data: MenuItemDetailDTO = await res.json();

        if (cancelled) return;

        setDetail(data);
        setSelectedByGroup({});
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setDetail({
            ...item,
            optionGroups: [],
          });
          setSelectedByGroup({});
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (item?.id) {
      void loadDetail();
    }

    return () => {
      cancelled = true;
    };
  }, [item]);

  const displayItem = detail ?? item;

  const optionGroups = useMemo(() => {
    return [...(detail?.optionGroups ?? [])].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
  }, [detail]);

  const optionPriceMap = useMemo(() => {
    const map = new Map<ID, number>();

    for (const group of detail?.optionGroups ?? []) {
      for (const opt of group.options ?? []) {
        map.set(opt.id, opt.priceDeltaCents ?? 0);
      }
    }

    return map;
  }, [detail]);

  const extraCents = useMemo(() => {
    return Object.values(selectedByGroup)
      .flat()
      .reduce((sum, optionId) => sum + (optionPriceMap.get(optionId) ?? 0), 0);
  }, [selectedByGroup, optionPriceMap]);

  const unitPriceCents = (displayItem.priceCents ?? 0) + extraCents;
  const totalPriceCents = unitPriceCents * qty;

  const canAdd = useMemo(() => {
    if (!isRamen) return true;
    if (!detail) return false;

    return optionGroups.every((group) => {
      if (!group.required) return true;
      const selected = selectedByGroup[group.id] ?? [];
      return selected.length >= (group.minSelected ?? 0);
    });
  }, [detail, isRamen, optionGroups, selectedByGroup]);

  function toggleOption(group: MenuOptionGroupDTO, optionId: ID) {
    setSelectedByGroup((prev) => {
      const current = prev[group.id] ?? [];
      const exists = current.includes(optionId);
      const maxSelected = Math.max(group.maxSelected ?? 1, 1);

      if (maxSelected === 1) {
        return {
          ...prev,
          [group.id]: exists ? [] : [optionId],
        };
      }

      if (exists) {
        return {
          ...prev,
          [group.id]: current.filter((id) => id !== optionId),
        };
      }

      if (current.length >= maxSelected) return prev;

      return {
        ...prev,
        [group.id]: [...current, optionId],
      };
    });
  }

  function buildConfig(): ItemConfig {
    const noodleOptionId = (selectedByGroup["noodle_group"]?.[0] ?? "") as ID;

    const toppings = (selectedByGroup["topping_group"] ?? []).map((id) => ({
      optionId: id,
      qty: 1,
    }));

    const firstMainRequiredGroup = optionGroups.find(
      (group) => group.id !== "noodle_group" && group.id !== "topping_group"
    );

    const proteinOptionId = firstMainRequiredGroup
      ? ((selectedByGroup[firstMainRequiredGroup.id]?.[0] ?? "") as ID)
      : ("" as ID);

    const selectedOptionNames: Record<string, string> = {};
    const selectedOptionPriceMap: Record<string, number> = {};

    for (const group of optionGroups) {
      for (const opt of group.options) {
        selectedOptionNames[opt.id] = opt.name;
        selectedOptionPriceMap[opt.id] = opt.priceDeltaCents ?? 0;
      }
    }

    return {
      proteinOptionId,
      noodleOptionId,
      toppings,
      note: note || undefined,
      selectedOptionNames,
      selectedOptionPriceMap,
    };
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="Close modal"
        onClick={onClose}
        type="button"
      />

      <div className="absolute inset-0 flex items-center justify-center p-2">
        <div
          className={`relative w-full max-w-[420px] ${panelH} overflow-hidden rounded-2xl bg-white shadow-2xl`}
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-tenton-brown bg-tenton-brown text-white shadow hover:bg-white hover:text-tenton-brown"
            aria-label="Close"
            type="button"
          >
            ✕
          </button>

          <div className="h-full overflow-y-auto pb-28">
            <div className="mb-3 mt-5 flex justify-center">
              <div className="relative h-44 w-60 overflow-hidden">
                {displayItem.imageUrl ? (
                  <Image
                    src={cldImage(displayItem.imageUrl)}
                    alt={displayItem.name}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </div>
            </div>

            <div className="px-6 text-center">
              <h2 className="text-[24px] font-semibold text-tenton-red">
                {displayItem.name}
              </h2>
              {displayItem.description ? (
                <p className="mt-1 text-[14px] text-black">
                  {displayItem.description}
                </p>
              ) : null}
            </div>

            <div className="mt-8 flex flex-col gap-8">
              {isRamen ? (
                loading ? (
                  <div className="px-6 pb-6 text-center text-sm text-black/50">
                    Loading options...
                  </div>
                ) : (
                  optionGroups.map((group, index) => {
                    const selectedIds = selectedByGroup[group.id] ?? [];
                    const isSingle = (group.maxSelected ?? 1) === 1;
                    const isCompleted = group.required
                      ? selectedIds.length >= (group.minSelected ?? 1)
                      : false;
                    const requiredBadgeClass = isCompleted
                      ? "bg-[#EDEAE8] text-tenton-brown"
                      : "bg-[#F5EBEA] text-tenton-red";

                    return (
                      <div key={group.id} className="px-6 pb-2">
                        <div className="flex items-center justify-center gap-2 text-[14px] font-semibold text-black/60">
                          <span>
                            STEP {String(index + 1).padStart(2, "0")}.{" "}
                            {group.title}
                          </span>
                          {group.required ? (
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${requiredBadgeClass}`}
                            >
                              {isCompleted ? (
                                <Check className="h-3 w-3 stroke-[3]" />
                              ) : (
                                <AlertCircle className="h-3 w-3 stroke-[2.5]" />
                              )}
                              Required
                            </span>
                          ) : null}
                        </div>

                        <div
                          className={
                            isSingle
                              ? "grid grid-cols-2"
                              : "mt-4 grid grid-cols-3 gap-4"
                          }
                        >
                          {group.options.map((opt) => {
                            const active = selectedIds.includes(opt.id);

                            return (
                              <button
                                key={opt.id}
                                onClick={() => toggleOption(group, opt.id)}
                                className="text-center"
                                type="button"
                              >
                                <div
                                  className={[
                                    "mx-auto relative overflow-hidden transition cursor-pointer",
                                    isSingle
                                      ? "h-30 w-30 hover:scale-110"
                                      : "h-20 w-20 hover:scale-110",
                                  ].join(" ")}
                                >
                                  {opt.imageUrl ? (
                                    <Image
                                      src={cldImage(opt.imageUrl)}
                                      alt={opt.name}
                                      fill
                                      className="object-contain"
                                    />
                                  ) : null}

                                  {!isSingle && active ? (
                                    <div className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-tenton-brown text-[11px] text-white">
                                      <Check className="h-3 w-3 stroke-[3]" />
                                    </div>
                                  ) : null}
                                </div>

                                {isSingle ? (
                                  <>
                                    <div className="flex items-center justify-center gap-2">
                                      <span
                                        className={[
                                          "flex h-4 w-4 items-center justify-center rounded-full border text-[10px]",
                                          active
                                            ? "border-tenton-brown bg-tenton-brown text-white"
                                            : "border-black/20 bg-white text-transparent",
                                        ].join(" ")}
                                      >
                                        <Check className="h-3 w-3 stroke-[3]" />
                                      </span>
                                      <div className="cursor-pointer text-xs font-semibold">
                                        {opt.name}
                                      </div>
                                    </div>

                                    {opt.description ? (
                                      <div className="mt-0.5 text-[10px] text-black/45">
                                        {opt.description}
                                      </div>
                                    ) : null}

                                    {opt.priceDeltaCents > 0 ? (
                                      <div className="text-[11px] text-black/40">
                                        {moneyFromCents(opt.priceDeltaCents)}
                                      </div>
                                    ) : null}
                                  </>
                                ) : (
                                  <>
                                    <div className="text-[11px] font-semibold text-black/70">
                                      {opt.name}
                                    </div>

                                    {opt.description ? (
                                      <div className="text-[10px] text-black/40">
                                        {opt.description}
                                      </div>
                                    ) : null}

                                    {opt.priceDeltaCents > 0 ? (
                                      <div className="text-[11px] text-black/40">
                                        {moneyFromCents(opt.priceDeltaCents)}
                                      </div>
                                    ) : null}
                                  </>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )
              ) : null}

              <div className="px-6 pb-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  Special instructions
                </div>

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note for the kitchen (Optional)"
                  className="w-full rounded-xl border border-black/10 bg-[#fbfaf8] px-3 py-2 text-sm outline-none focus:border-tenton-brown"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 border-t border-black/10 bg-white">
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="flex items-center overflow-hidden rounded-full border border-black/10 bg-[#f4f1ea]">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center text-lg text-black/70 hover:bg-black/5"
                  aria-label="Decrease quantity"
                  type="button"
                >
                  −
                </button>
                <div className="w-10 text-center text-sm font-semibold">
                  {qty}
                </div>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center text-lg text-black/70 hover:bg-black/5"
                  aria-label="Increase quantity"
                  type="button"
                >
                  +
                </button>
              </div>

              <Button
                disabled={!canAdd}
                onClick={() => onAdd(item, qty, buildConfig())}
                size="sm"
                variant={canAdd ? "primary" : "ghost"}
                className="h-10 flex-1"
              >
                <span className="opacity-95">Add to order</span>
                <span className="opacity-90">
                  {moneyFromCents(totalPriceCents)}
                </span>
              </Button>
            </div>

            {!canAdd ? (
              <div className="px-6 pb-4 -mt-2 text-center text-[11px] text-tenton-red">
                Please complete all required selections
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
