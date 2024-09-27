"use client";

import React, { useState } from "react";
import {
  Typography,
  Input,
  Button,
  Table,
  Modal,
  Tooltip,
  Checkbox,
} from "antd";
import { EyeOutlined, TranslationOutlined } from "@ant-design/icons";
import { Foundation, SearchResponse } from "./types";

const { Title, Text } = Typography;

export default function Home() {
  const [projectDescription, setProjectDescription] = useState("");
  const [foundationPurpose, setFoundationPurpose] = useState("");
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [transforming, setTransforming] = useState(false);
  const [selectedFoundation, setSelectedFoundation] =
    useState<Foundation | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [translatingPurpose, setTranslatingPurpose] = useState<string | null>(
    null
  );
  const [saveDescription, setSaveDescription] = useState(false);

  const handleTransformDescription = async () => {
    setTransforming(true);
    try {
      const response = await fetch("/api/transform-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectDescription, saveDescription }),
      });
      const data = await response.json();
      setFoundationPurpose(data.transformedPurpose);
    } catch (error) {
      console.error("Error transforming description:", error);
    }
    setTransforming(false);
  };

  const handleFindFoundations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/find-foundations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foundationPurpose }),
      });
      const data: SearchResponse = await response.json();
      setSearchResponse(data);
    } catch (error) {
      console.error("Error finding foundations:", error);
    }
    setLoading(false);
  };

  const handleTranslatePurpose = async (purpose: string) => {
    setTranslatingPurpose(purpose);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: purpose }),
      });
      const data = await response.json();

      // Update the foundation's purpose with the translated text
      setSearchResponse((prevResponse) => {
        if (!prevResponse) return null;
        return {
          ...prevResponse,
          foundations: prevResponse.foundations.map((foundation) =>
            foundation.purpose === purpose
              ? { ...foundation, purpose: data.translatedText }
              : foundation
          ),
        };
      });
    } catch (error) {
      console.error("Error translating purpose:", error);
    }
    setTranslatingPurpose(null);
  };

  const showFoundationDetails = (foundation: Foundation) => {
    setSelectedFoundation(foundation);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "URLs",
      dataIndex: "contact",
      key: "urls",
      render: (contact: Foundation["contact"]) => (
        <>
          {contact.urls.map((url, index) => (
            <div key={index}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
            </div>
          ))}
        </>
      ),
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (score: number) => score.toFixed(4),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Foundation) => (
        <div className="flex space-x-2">
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => showFoundationDetails(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Translate Purpose">
            <Button
              icon={<TranslationOutlined />}
              onClick={() => handleTranslatePurpose(record.purpose || "")}
              loading={translatingPurpose === record.purpose}
              size="small"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const renderFoundationDetails = (foundation: Foundation) => (
    <div>
      <Title level={3}>Basic Information</Title>
      <p>
        <strong>Internal ID:</strong> {foundation.internalId}
      </p>
      <p>
        <strong>Stiftungs ID:</strong> {foundation.stiftungsId}
      </p>
      <p>
        <strong>Name:</strong> {foundation.name}
      </p>
      <p>
        <strong>Purpose:</strong> {foundation.purpose}
      </p>
      <p>
        <strong>Score:</strong> {foundation.score.toFixed(4)}
      </p>

      <Title level={3} className="mt-4">
        Contact Information
      </Title>
      {foundation.contact.address.length > 0 && (
        <p>
          <strong>Address:</strong> {foundation.contact.address.join(", ")}
        </p>
      )}
      {foundation.contact.phone.length > 0 && (
        <p>
          <strong>Phone:</strong> {foundation.contact.phone.join(", ")}
        </p>
      )}
      {foundation.contact.fax.length > 0 && (
        <p>
          <strong>Fax:</strong> {foundation.contact.fax.join(", ")}
        </p>
      )}
      {foundation.contact.emails.length > 0 && (
        <p>
          <strong>Emails:</strong>{" "}
          {foundation.contact.emails.map((email, index) => (
            <React.Fragment key={index}>
              {index > 0 && ", "}
              <a href={`mailto:${email}`}>{email}</a>
            </React.Fragment>
          ))}
        </p>
      )}
      {foundation.contact.urls.length > 0 && (
        <p>
          <strong>URLs:</strong>{" "}
          {foundation.contact.urls.map((url, index) => (
            <React.Fragment key={index}>
              {index > 0 && ", "}
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
            </React.Fragment>
          ))}
        </p>
      )}

      <Title level={3} className="mt-4">
        Additional Content
      </Title>
      {foundation.content.map((item, index) => (
        <div key={index} className="mb-4">
          <Title level={4}>{item.title}</Title>
          <ul>
            {item.lines.map((line, lineIndex) => (
              <li key={lineIndex}>{line}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <Title level={2} className="m-0">
          German Foundations
        </Title>
        <div className="flex flex-col sm:flex-row sm:space-x-2 mt-2 sm:mt-0">
          <a
            href="https://github.com/henophilia/funding.henophilia.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginBottom: "0.25rem" }}
          >
            <img
              src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white"
              alt="GitHub"
            />
          </a>
          <a
            href="https://docs.google.com/presentation/d/1dKf9l3JTdssQXnSpVuIboeOEqy9rVFIqIfidVvdiB_g/edit"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://img.shields.io/badge/Strategic%20Proposal-4285F4?style=flat&logo=google-slides&logoColor=white"
              alt="Roadmap"
            />
          </a>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
          <Input.TextArea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Enter your project description in any language"
            rows={4}
          />
          <div className="mt-2 mb-2">
            <Checkbox
              checked={saveDescription}
              onChange={(e) => setSaveDescription(e.target.checked)}
            >
              Check this box to allow us to save your input project description
              in our database, so that we can use it to improve this service.
              Please contact synergies@henophilia.org for co-creation and
              collaboration.
            </Checkbox>
          </div>
          <Button
            type="primary"
            onClick={handleTransformDescription}
            loading={transforming}
            className="mt-2 w-full sm:w-auto"
          >
            Transform to foundation purpose
          </Button>
        </div>
        <div className="w-full sm:w-1/2">
          <Input.TextArea
            value={foundationPurpose}
            onChange={(e) => setFoundationPurpose(e.target.value)}
            placeholder="Foundation purpose in German will appear here"
            rows={4}
          />
          <Button
            type="primary"
            onClick={handleFindFoundations}
            loading={loading}
            className="mt-4 w-full sm:w-auto"
            disabled={!foundationPurpose}
          >
            Find relevant foundations
          </Button>
        </div>
      </div>
      {searchResponse && (
        <>
          <div className="mt-8 mb-4">
            <Text>
              Search execution time: {searchResponse.executionTime.toFixed(2)}{" "}
              seconds
            </Text>
            <br />
            <Text>
              Total foundations in database: {searchResponse.totalVectors}
            </Text>
          </div>
          <Table
            dataSource={searchResponse.foundations}
            columns={columns}
            rowKey="internalId"
          />
        </>
      )}
      <Modal
        title={<Title level={2}>Foundation Details</Title>}
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        {selectedFoundation && renderFoundationDetails(selectedFoundation)}
      </Modal>
    </div>
  );
}
