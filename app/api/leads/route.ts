import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fullName, cedula, telefono, ciudad, servicio } = body;

        // Validate incoming data
        if (!fullName || !cedula || !telefono || !ciudad || !servicio) {
            return NextResponse.json(
                { error: "Todos los campos son obligatorios." },
                { status: 400 }
            );
        }

        if (cedula.length !== 10 || !/^\d+$/.test(cedula)) {
            return NextResponse.json(
                { error: "Cédula inválida." },
                { status: 400 }
            );
        }

        if (!/^\d+$/.test(telefono)) {
            return NextResponse.json(
                { error: "Teléfono inválido." },
                { status: 400 }
            );
        }

        // Google Sheets Integration
        if (
            !process.env.GOOGLE_CLIENT_EMAIL ||
            !process.env.GOOGLE_PRIVATE_KEY ||
            !process.env.GOOGLE_SHEET_ID
        ) {
            console.error("Missing Google Sheets credentials in environment.");
            return NextResponse.json(
                { message: "Lead recibido exitosamente (Simulado por falta de config)." },
                { status: 200 }
            );
        }

        // Authenticate with Google
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                // Handling escaped newlines in Vercel env vars
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: [
                "https://www.googleapis.com/auth/drive",
                "https://www.googleapis.com/auth/drive.file",
                "https://www.googleapis.com/auth/spreadsheets",
            ],
        });

        const sheets = google.sheets({ auth, version: "v4" });

        // Append data to Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: "A:F",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [
                    [new Date().toISOString(), fullName, cedula, telefono, ciudad, servicio],
                ],
            },
        });

        return NextResponse.json(
            { message: "Lead recibido y guardado exitosamente." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing lead:", error);
        return NextResponse.json(
            { error: "Error interno del servidor." },
            { status: 500 }
        );
    }
}
