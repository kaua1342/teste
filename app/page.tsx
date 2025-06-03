"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Users, ShoppingCart, TrendingUp, Package } from "lucide-react"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

interface Transaction {
  id: string
  type: "compra" | "venda"
  clientId?: string
  clientName?: string
  amount: number
  quantity: number
  pricePerKg: number
  date: string
  description: string
}

// Função para formatar valores monetários em formato brasileiro
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Função para formatar números com separadores de milhares
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("pt-BR").format(value)
}

export default function StrawberryManagement() {
  const [clients, setClients] = useState<Client[]>([
    { id: "1", name: "João Silva", email: "joao@email.com", phone: "(11) 99999-9999", address: "Rua das Flores, 123" },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "(11) 88888-8888",
      address: "Av. Principal, 456",
    },
  ])

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "venda",
      clientId: "1",
      clientName: "João Silva",
      amount: 1500000,
      quantity: 5000,
      pricePerKg: 300,
      date: "2024-01-15",
      description: "Venda de morangos premium para rede de supermercados",
    },
    {
      id: "2",
      type: "compra",
      amount: 850000,
      quantity: 10000,
      pricePerKg: 85,
      date: "2024-01-14",
      description: "Compra de mudas e insumos para plantação",
    },
  ])

  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false)
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", address: "" })
  const [newTransaction, setNewTransaction] = useState({
    type: "venda" as "compra" | "venda",
    clientId: "",
    amount: 0,
    quantity: 0,
    pricePerKg: 0,
    date: "",
    description: "",
  })

  const handleAddClient = () => {
    if (editingClient) {
      setClients(clients.map((c) => (c.id === editingClient.id ? { ...editingClient, ...newClient } : c)))
      setEditingClient(null)
    } else {
      const client: Client = {
        id: Date.now().toString(),
        ...newClient,
      }
      setClients([...clients, client])
    }
    setNewClient({ name: "", email: "", phone: "", address: "" })
    setIsClientDialogOpen(false)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setNewClient({ name: client.name, email: client.email, phone: client.phone, address: client.address })
    setIsClientDialogOpen(true)
  }

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter((c) => c.id !== id))
  }

  const handleAddTransaction = () => {
    const clientName = newTransaction.clientId ? clients.find((c) => c.id === newTransaction.clientId)?.name : undefined

    if (editingTransaction) {
      setTransactions(
        transactions.map((t) =>
          t.id === editingTransaction.id
            ? {
                ...editingTransaction,
                ...newTransaction,
                clientName,
                amount: newTransaction.quantity * newTransaction.pricePerKg,
              }
            : t,
        ),
      )
      setEditingTransaction(null)
    } else {
      const transaction: Transaction = {
        id: Date.now().toString(),
        ...newTransaction,
        clientName,
        amount: newTransaction.quantity * newTransaction.pricePerKg,
      }
      setTransactions([...transactions, transaction])
    }
    setNewTransaction({
      type: "venda",
      clientId: "",
      amount: 0,
      quantity: 0,
      pricePerKg: 0,
      date: "",
      description: "",
    })
    setIsTransactionDialogOpen(false)
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setNewTransaction({
      type: transaction.type,
      clientId: transaction.clientId || "",
      amount: transaction.amount,
      quantity: transaction.quantity,
      pricePerKg: transaction.pricePerKg,
      date: transaction.date,
      description: transaction.description,
    })
    setIsTransactionDialogOpen(true)
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const totalVendas = transactions.filter((t) => t.type === "venda").reduce((sum, t) => sum + t.amount, 0)
  const totalCompras = transactions.filter((t) => t.type === "compra").reduce((sum, t) => sum + t.amount, 0)
  const lucro = totalVendas - totalCompras

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-red-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-green-500 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
              Gerenciador de Morangos
            </h1>
          </div>
          <p className="text-gray-700 text-lg">Sistema Profissional de Gestão Agrícola</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-300 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Total Vendas</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{formatCurrency(totalVendas)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-300 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Total Compras</CardTitle>
              <ShoppingCart className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{formatCurrency(totalCompras)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800">Lucro Líquido</CardTitle>
              <Package className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${lucro >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                {formatCurrency(lucro)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-300 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-rose-800">Total Clientes</CardTitle>
              <Users className="h-5 w-5 text-rose-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-700">{formatNumber(clients.length)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white shadow-md">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Clientes
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Transações
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-gray-200">
                <CardHeader className="bg-gradient-to-r from-red-500 to-green-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    Últimas Transações
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-600">
                            {transaction.clientName || "Sem cliente"} •{" "}
                            {new Date(transaction.date).toLocaleDateString("pt-BR")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatNumber(transaction.quantity)}kg × {formatCurrency(transaction.pricePerKg)}/kg
                          </p>
                        </div>
                        <Badge
                          variant={transaction.type === "venda" ? "default" : "secondary"}
                          className={
                            transaction.type === "venda"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          }
                        >
                          {transaction.type === "venda" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-gray-200">
                <CardHeader className="bg-gradient-to-r from-green-500 to-red-500 text-white rounded-t-lg">
                  <CardTitle>Resumo do Negócio</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Morangos Premium</h3>
                      <p className="text-3xl font-bold text-green-600">{formatCurrency(350)}/kg</p>
                      <p className="text-sm text-green-700 mt-1">Qualidade Superior</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-2 border-red-200">
                      <h3 className="text-lg font-semibold text-red-800 mb-2">Morangos Orgânicos</h3>
                      <p className="text-3xl font-bold text-red-600">{formatCurrency(420)}/kg</p>
                      <p className="text-sm text-red-700 mt-1">100% Natural</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Gestão de Clientes</h2>
              <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white shadow-lg"
                    onClick={() => {
                      setEditingClient(null)
                      setNewClient({ name: "", email: "", phone: "", address: "" })
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-xl text-gray-800">
                      {editingClient ? "Editar Cliente" : "Novo Cliente"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingClient ? "Edite as informações do cliente" : "Adicione um novo cliente ao sistema"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={newClient.name}
                        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newClient.email}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={newClient.phone}
                        onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Textarea
                        id="address"
                        value={newClient.address}
                        onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddClient} className="w-full bg-green-500 hover:bg-green-600">
                    {editingClient ? "Salvar Alterações" : "Adicionar Cliente"}
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {clients.map((client) => (
                <Card key={client.id} className="shadow-lg border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{client.name}</h3>
                        <p className="text-gray-600">{client.email}</p>
                        <p className="text-gray-600">{client.phone}</p>
                        <p className="text-gray-600">{client.address}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClient(client)}
                          className="border-green-300 text-green-600 hover:bg-green-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClient(client.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Controle de Compras e Vendas</h2>
              <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white shadow-lg"
                    onClick={() => {
                      setEditingTransaction(null)
                      setNewTransaction({
                        type: "venda",
                        clientId: "",
                        amount: 0,
                        quantity: 0,
                        pricePerKg: 0,
                        date: "",
                        description: "",
                      })
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Transação
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-xl text-gray-800">
                      {editingTransaction ? "Editar Transação" : "Nova Transação"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingTransaction ? "Edite os dados da transação" : "Registre uma nova compra ou venda"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Tipo</Label>
                      <Select
                        value={newTransaction.type}
                        onValueChange={(value: "compra" | "venda") =>
                          setNewTransaction({ ...newTransaction, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="venda">Venda</SelectItem>
                          <SelectItem value="compra">Compra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newTransaction.type === "venda" && (
                      <div className="grid gap-2">
                        <Label htmlFor="client">Cliente</Label>
                        <Select
                          value={newTransaction.clientId}
                          onValueChange={(value) => setNewTransaction({ ...newTransaction, clientId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="quantity">Quantidade (kg)</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={newTransaction.quantity}
                          onChange={(e) =>
                            setNewTransaction({ ...newTransaction, quantity: Number.parseFloat(e.target.value) || 0 })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="pricePerKg">Preço por kg</Label>
                        <Input
                          id="pricePerKg"
                          type="number"
                          step="0.01"
                          value={newTransaction.pricePerKg}
                          onChange={(e) =>
                            setNewTransaction({ ...newTransaction, pricePerKg: Number.parseFloat(e.target.value) || 0 })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                      />
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-red-50 rounded-lg border-2 border-gray-200">
                      <p className="text-lg font-semibold text-gray-800">
                        Total: {formatCurrency(newTransaction.quantity * newTransaction.pricePerKg)}
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleAddTransaction} className="w-full bg-red-500 hover:bg-red-600">
                    {editingTransaction ? "Salvar Alterações" : "Adicionar Transação"}
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="shadow-lg border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge
                            variant={transaction.type === "venda" ? "default" : "secondary"}
                            className={`${transaction.type === "venda" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600 text-white"} px-3 py-1`}
                          >
                            {transaction.type.toUpperCase()}
                          </Badge>
                          <span className="text-2xl font-bold text-gray-800">{formatCurrency(transaction.amount)}</span>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2">{transaction.description}</h3>
                        <p className="text-gray-600 mb-1">
                          {transaction.clientName && `Cliente: ${transaction.clientName} • `}
                          {formatNumber(transaction.quantity)}kg × {formatCurrency(transaction.pricePerKg)}/kg
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTransaction(transaction)}
                          className="border-green-300 text-green-600 hover:bg-green-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Relatórios Financeiros</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-gray-200">
                <CardHeader className="bg-gradient-to-r from-green-500 to-red-500 text-white rounded-t-lg">
                  <CardTitle>Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-green-800">Total de Vendas:</span>
                      <span className="font-bold text-green-600 text-lg">{formatCurrency(totalVendas)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium text-red-800">Total de Compras:</span>
                      <span className="font-bold text-red-600 text-lg">{formatCurrency(totalCompras)}</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-red-50 rounded-lg border-2 border-gray-200">
                      <span className="font-semibold text-gray-800 text-lg">Lucro Líquido:</span>
                      <span className={`font-bold text-xl ${lucro >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(lucro)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-gray-200">
                <CardHeader className="bg-gradient-to-r from-red-500 to-green-500 text-white rounded-t-lg">
                  <CardTitle>Top Clientes</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {clients.slice(0, 5).map((client, index) => {
                      const clientTransactions = transactions.filter((t) => t.clientId === client.id)
                      const clientTotal = clientTransactions.reduce((sum, t) => sum + t.amount, 0)
                      return (
                        <div
                          key={client.id}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border"
                        >
                          <div>
                            <p className="font-medium text-gray-800">{client.name}</p>
                            <p className="text-sm text-gray-600">
                              {formatNumber(clientTransactions.length)} transações
                            </p>
                          </div>
                          <span className="font-bold text-gray-800">{formatCurrency(clientTotal)}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg border-gray-200">
              <CardHeader className="bg-gradient-to-r from-green-500 to-red-500 text-white rounded-t-lg">
                <CardTitle>Informações do Negócio</CardTitle>
                <CardDescription className="text-green-100">Dados sobre seus produtos e operações</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Morangos Frescos</h3>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(300)}/kg</p>
                    <p className="text-sm text-green-700 mt-1">Qualidade Premium</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-2 border-red-200">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Morangos Orgânicos</h3>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(420)}/kg</p>
                    <p className="text-sm text-red-700 mt-1">100% Natural</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border-2 border-emerald-200">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-800 mb-2">Produção Total</h3>
                    <p className="text-2xl font-bold text-emerald-600">{formatNumber(15000)}kg</p>
                    <p className="text-sm text-emerald-700 mt-1">Este mês</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
