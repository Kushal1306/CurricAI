"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Loader2, Youtube, ChevronDown, ChevronUp, ChevronRight, Download } from "lucide-react"
import { jsPDF } from "jspdf"
import 'jspdf-autotable'
import axios from 'axios'


interface SubTopic {
  title: string
  description: string
  videoUrl: string
}

interface CurriculumItem {
  title: string
  description: string
  videoUrl: string
  subtopics: SubTopic[]
}

export function Dashboard() {
  const [prompt, setPrompt] = useState("Machine Learning Fundamentals")
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [loading, setLoading] = useState(false)
  const [openVideo, setOpenVideo] = useState<number | null>(null)
  const [openSubtopics, setOpenSubtopics] = useState<number | null>(null)

  const generateCurriculum = async () => {
    setLoading(true);
    try { 
          const response=await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/generate-curriculum`,{
            prompt
          });
          setCurriculum(response.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false)
  }

  const toggleVideo = (index: number) => {
    setOpenVideo(openVideo === index ? null : index)
  }

  const toggleSubtopics = (index: number) => {
    setOpenSubtopics(openSubtopics === index ? null : index)
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.text(`AI Curriculum: ${prompt}`, 14, 20)
    
    let yOffset = 40
    
    curriculum.forEach((item, index) => {
      doc.setFontSize(16)
      doc.text(`${index + 1}. ${item.title}`, 14, yOffset)
      yOffset += 10
      
      doc.setFontSize(12)
      doc.text(item.description, 14, yOffset, { maxWidth: 180 })
      yOffset += 20
      
      doc.setTextColor(0, 0, 255)
      doc.textWithLink("Watch Video", 14, yOffset, { url: item.videoUrl })
      doc.setTextColor(0, 0, 0)
      yOffset += 10
      
      doc.setFontSize(14)
      doc.text("Subtopics:", 14, yOffset)
      yOffset += 10
      
      item.subtopics.forEach((subtopic, subIndex) => {
        doc.setFontSize(12)
        doc.text(`${index + 1}.${subIndex + 1} ${subtopic.title}`, 20, yOffset)
        yOffset += 7
        doc.setFontSize(10)
        doc.text(subtopic.description, 25, yOffset, { maxWidth: 170 })
        yOffset += 10
        doc.setTextColor(0, 0, 255)
        doc.textWithLink("Watch Video", 25, yOffset, { url: subtopic.videoUrl })
        doc.setTextColor(0, 0, 0)
        yOffset += 15
      })
      
      yOffset += 10
      
      if (yOffset > 280) {
        doc.addPage()
        yOffset = 20
      }
    })
    
    doc.save("ai_curriculum.pdf")
  }

  return (
    <div className="container mx-auto p-12 md:p-20 bg-white min-h-screen">
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-black">AI Curriculum Generator</h1>
        {curriculum.length > 0 && (
          <Button onClick={downloadPDF} className="bg-black text-white hover:bg-gray-800">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        )}
      </header>
      <div className="flex space-x-2 mb-6">
        <Input
          placeholder="Enter a topic to generate curriculum..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow border-black text-black"
        />
        <Button onClick={generateCurriculum} disabled={loading} className="bg-black text-white hover:bg-gray-800">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate
        </Button>
      </div>
      {curriculum.length > 0 && (
        <div className="relative">
          {curriculum.map((item, index) => (
            <div key={index} className="mb-8 relative">
              <Card className="border-2 border-black">
                <CardHeader className="bg-black text-white p-4">
                  <CardTitle className="flex items-center">
                    <span className="mr-2 flex-shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <Collapsible open={openVideo === index} onOpenChange={() => toggleVideo(index)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full flex justify-between items-center mb-4 border-black text-black hover:bg-gray-100">
                        <span className="flex items-center text-black">
                          <Youtube className="mr-2 h-4 w-4" />
                          Watch Video
                        </span>
                        {openVideo === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 rounded-md">
                      <div className="relative" style={{ paddingBottom: '40%', height: 0 }}>
                        <iframe
                          src={item.videoUrl}
                          title={`Video for ${item.title}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full border border-black rounded-md"
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  <Collapsible open={openSubtopics === index} onOpenChange={() => toggleSubtopics(index)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full flex justify-between items-center text-black hover:bg-gray-100">
                        <span className="flex items-center">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Subtopics
                        </span>
                        {openSubtopics === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-4">
                      {item.subtopics.map((subtopic, subIndex) => (
                        <div key={subIndex} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                          <h4 className="font-semibold text-black mb-2">{subtopic.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{subtopic.description}</p>
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full flex justify-between items-center border-black text-black hover:bg-gray-100">
                                <span className="flex items-center">
                                  <Youtube className="mr-2 h-3 w-3" />
                                  Watch Subtopic Video
                                </span>
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2">
                              <div className="relative" style={{ paddingBottom: '40%', height: 0 }}>
                                <iframe
                                  src={subtopic.videoUrl}
                                  title={`Video for ${subtopic.title}`}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="absolute top-0 left-0 w-full h-full border border-black rounded-md"
                                />
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
              {index < curriculum.length - 1 && (
                <div className="absolute left-4 top-full w-0.5 h-8 bg-black"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}