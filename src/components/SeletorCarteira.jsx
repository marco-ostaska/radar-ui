import { useCarteira } from '@/contexts/CarteiraContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SeletorCarteira() {
  const { carteiraId, setCarteiraId, carteiras } = useCarteira();
  
  return (
    <div className="flex items-center">
      <span className="mr-2 text-sm font-medium">Carteira:</span>
      <Select value={String(carteiraId)} onValueChange={(value) => setCarteiraId(Number(value))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione uma carteira" />
        </SelectTrigger>
        <SelectContent>
          {carteiras.map((carteira) => (
            <SelectItem key={carteira.id} value={String(carteira.id)}>
              {carteira.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
