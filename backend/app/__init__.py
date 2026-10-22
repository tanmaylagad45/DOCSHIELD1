"""
DocShield Backend Application Package.
"""

import os
# Ensure pure Python mode to ensure compatibility across all environments
os.environ.setdefault("DISABLE_SQLALCHEMY_CEXT", "1")
