import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const requests = [
  {
    id: 1,
    customer: "John Doe",
    type: "Facebook",
    status: "Pending",
    date: "2023-06-01",
  },
  {
    id: 2,
    customer: "Jane Smith",
    type: "Instagram",
    status: "In Progress",
    date: "2023-05-28",
  },
  {
    id: 3,
    customer: "Bob Johnson",
    type: "Facebook",
    status: "Completed",
    date: "2023-05-25",
  },
];

export function RequestList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Requests</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto w-full">
          <div className="min-w-max">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.customer}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.type === "Facebook" ? "default" : "secondary"
                        }
                      >
                        {request.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === "Completed"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
