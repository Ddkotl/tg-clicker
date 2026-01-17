"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { BankExchangeForm } from "./_ui/exchange_form";
import { icons } from "@/shared/lib/icons";

export function SwitchResurseces() {
  return (
    <Tabs defaultValue="stones_to_cristals" className="w-full">
      <TabsList className="w-full grid grid-cols-2 h-auto gap-2 bg-inherit shadow-2xl">
        <TabsTrigger value="stones_to_cristals">
          {icons.stone({})} → {icons.crystal({})}
        </TabsTrigger>
        <TabsTrigger value="cristals_to_stones">
          {icons.crystal({})} → {icons.stone({})}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="stones_to_cristals">
        <BankExchangeForm exchange_type="stones_to_cristals" />
      </TabsContent>
      <TabsContent value="cristals_to_stones">
        <BankExchangeForm exchange_type="cristals_to_stones" />
      </TabsContent>
    </Tabs>
  );
}
