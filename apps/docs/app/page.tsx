
import {FlickeringGrid} from "@/components/ui/flickering-grid"


export default function Home() {
  

  return(

    
    <div>
      <FlickeringGrid
      className="absolute inset-0 z-0 size-full"
      squareSize={10}
      gridGap={6}
      color="#6B7280"
      maxOpacity={0.3}
      flickerChance={0.1}
      />
    </div>







  )
  
}
