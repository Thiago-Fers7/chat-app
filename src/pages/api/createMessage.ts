import { NextApiRequest } from "next";
import { NextApiResponseIO } from "./next";

export default function handler(req: NextApiRequest, res: NextApiResponseIO) {
	if (req.method === 'POST') {
		res.socket.server.io.emit('message', req.body)
	}

	res.end()
}