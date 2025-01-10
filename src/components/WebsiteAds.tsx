import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function WebsiteAds() {
  const ads = [
    { id: 1, title: "Summer Sale", description: "Get 50% off on all summer items", image: "/placeholder.svg", platform: "Facebook" },
    { id: 2, title: "New Collection", description: "Check out our latest fashion collection", image: "/placeholder.svg", platform: "Instagram" },
    { id: 3, title: "Limited Offer", description: "Buy one, get one free on selected items", image: "/placeholder.svg", platform: "Facebook" },
    { id: 4, title: "City Center Billboard", description: "Prime location for maximum visibility", image: "/placeholder.svg", platform: "Billboard" },
    { id: 5, title: "Morning Drive Time", description: "30-second spot during peak commute hours", image: "/placeholder.svg", platform: "Radio" },
  ]

  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {ads.map((ad) => (
          <Card key={ad.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{ad.title}</CardTitle>
              <CardDescription>{ad.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <img src={ad.image} alt={ad.title} className="w-full h-40 object-cover mb-4 rounded-md" />
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${
                  ad.platform === 'Facebook' ? 'text-blue-600' :
                  ad.platform === 'Instagram' ? 'text-pink-600' :
                  ad.platform === 'Billboard' ? 'text-green-600' :
                  'text-purple-600' // for Radio
                }`}>
                  {ad.platform}
                </span>
                <Button variant="outline">Edit Ad</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Button onClick={() => router.push("/campaign/campaigns")} size="lg">View All Ads</Button>
      </div>
    </div>
  )
}

